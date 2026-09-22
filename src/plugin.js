/* global ZoteroObsidianCore, Cc, Ci */
var ZoteroObsidianReadonlyPlugin = class ZoteroObsidianReadonlyPlugin {
  constructor(ZoteroAPI, ServicesAPI, core) {
    this.Zotero = ZoteroAPI;
    this.Services = ServicesAPI;
    this.core = core;
    this.toolsMenuID = "zotero-obsidian-readonly-export-tools";
    this.contextMenuID = "zotero-obsidian-readonly-export-context";
    this.windows = new Set();
  }

  start() {
    for (const win of this.Zotero.getMainWindows()) this.addToWindow(win);
  }

  stop() {
    for (const win of this.windows) this.removeFromWindow(win);
  }

  addToWindow(win) {
    if (!win || win.document.getElementById(this.toolsMenuID)) return;
    const popup = win.document.getElementById("menu_ToolsPopup");
    if (!popup) return;
    const item = win.document.createXULElement("menuitem");
    item.id = this.toolsMenuID;
    item.setAttribute("label", "Push selezione in Markdown…");
    item.addEventListener("command", () => this.exportSelection(win));
    popup.appendChild(item);

    const contextPopup = win.document.getElementById("zotero-itemmenu");
    if (contextPopup) {
      const contextItem = win.document.createXULElement("menuitem");
      contextItem.id = this.contextMenuID;
      contextItem.setAttribute("label", "Push selezione in Markdown…");
      contextItem.addEventListener("command", () => this.exportSelection(win));
      const updateVisibility = () => {
        const hasRegularItem = win.ZoteroPane.getSelectedItems()
          .some(selected => selected.isRegularItem());
        contextItem.hidden = !hasRegularItem;
      };
      contextItem._zoteroObsidianPopupHandler = updateVisibility;
      contextPopup.addEventListener("popupshowing", updateVisibility);
      contextPopup.appendChild(contextItem);
    }
    this.windows.add(win);
  }

  removeFromWindow(win) {
    win?.document.getElementById(this.toolsMenuID)?.remove();
    const contextItem = win?.document.getElementById(this.contextMenuID);
    const contextPopup = win?.document.getElementById("zotero-itemmenu");
    if (contextItem?._zoteroObsidianPopupHandler) {
      contextPopup?.removeEventListener(
        "popupshowing",
        contextItem._zoteroObsidianPopupHandler
      );
    }
    contextItem?.remove();
    this.windows.delete(win);
  }

  async chooseDirectory(win) {
    const picker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    picker.init(win.browsingContext, "Scegli la cartella di destinazione Markdown", Ci.nsIFilePicker.modeGetFolder);
    const result = await new Promise(resolve => picker.open(resolve));
    if (result !== Ci.nsIFilePicker.returnOK) return null;
    return picker.file.path;
  }

  async exportSelection(win) {
    try {
      const selected = win.ZoteroPane.getSelectedItems().filter(item => item.isRegularItem());
      if (!selected.length) {
        this.alert(win, "Seleziona almeno un elemento bibliografico.");
        return;
      }
      const directory = await this.chooseDirectory(win);
      if (!directory) return;
      let count = 0;
      for (const item of selected) {
        const model = await this.readItem(item);
        await this.writeMarkdown(directory, model);
        count++;
      }
      this.alert(win, `${count} file Markdown esportati. Zotero non è stato modificato.`);
    } catch (error) {
      this.Zotero.logError(error);
      this.alert(win, `Esportazione non riuscita:\n${error.message}`);
    }
  }

  async readItem(item) {
    const libraryPrefix = this.Zotero.API.getLibraryPrefix(item.libraryID);
    const extra = item.getField("extra") || "";
    const citationKey = item.getField("citationKey") ||
      (extra.match(/^Citation Key:\s*(.+)$/mi)?.[1] || "").trim();
    const collections = item.getCollections().map(id => this.Zotero.Collections.get(id)?.name).filter(Boolean);
    const notes = this.Zotero.Items.get(item.getNotes()).map(note => ({ key: note.key, note: note.getNote() }));
    const annotations = [];
    for (const attachment of this.Zotero.Items.get(item.getAttachments())) {
      for (const annotation of attachment.getAnnotations()) {
        const data = annotation.toJSON();
        const position = typeof data.annotationPosition === "string"
          ? JSON.parse(data.annotationPosition || "{}") : (data.annotationPosition || {});
        let imageSourcePath = "";
        if (["image", "ink"].includes(data.annotationType) &&
            await this.Zotero.Annotations.hasCacheImage(annotation)) {
          imageSourcePath = this.Zotero.Annotations.getCacheImagePath(annotation);
        }
        const pageLabel = data.annotationPageLabel ||
          (Number.isInteger(position.pageIndex) ? position.pageIndex + 1 : "");
        annotations.push({
          key: annotation.key,
          type: data.annotationType,
          text: data.annotationText,
          comment: data.annotationComment,
          pageLabel,
          tags: annotation.getTags().map(tag => tag.tag),
          imageSourcePath,
          openURI: `zotero://open-pdf/${libraryPrefix}/items/${attachment.key}` +
            `?page=${encodeURIComponent(pageLabel || 1)}&annotation=${annotation.key}`
        });
      }
    }
    const date = item.getField("date") || "";
    return {
      key: item.key,
      libraryID: item.libraryID,
      version: item.version,
      citationKey,
      title: item.getField("title"),
      creators: item.getCreators(),
      date,
      year: date.match(/\b(\d{4})\b/)?.[1] || "",
      itemType: this.Zotero.ItemTypes.getName(item.itemTypeID),
      DOI: item.getField("DOI"),
      ISBN: item.getField("ISBN"),
      url: item.getField("url"),
      abstract: item.getField("abstractNote"),
      collections,
      tags: item.getTags().map(tag => tag.tag),
      notes,
      annotations,
      zoteroURI: `zotero://select/${libraryPrefix}/items/${item.key}`
    };
  }

  async writeMarkdown(directory, model) {
    const assetRelativeDir = `./assets/zotero-${model.key}`;
    const assetDir = PathUtils.join(directory, "assets", `zotero-${model.key}`);
    for (const annotation of model.annotations) {
      if (!annotation.imageSourcePath) continue;
      await IOUtils.makeDirectory(assetDir, { createAncestors: true, ignoreExisting: true });
      const imageName = `${annotation.key}.png`;
      const destination = PathUtils.join(assetDir, imageName);
      await IOUtils.copy(annotation.imageSourcePath, destination, { noOverwrite: false });
      annotation.imagePath = `${assetRelativeDir}/${imageName}`;
    }
    const leaf = `${this.core.safeFilename(model.title)} - ${model.key}.md`;
    const path = PathUtils.join(directory, leaf);
    let existing = "";
    if (await IOUtils.exists(path)) existing = await IOUtils.readUTF8(path);
    const output = this.core.merge(existing, model, new Date().toISOString());
    await IOUtils.writeUTF8(path, output, { tmpPath: path + ".tmp" });
  }

  alert(win, message) {
    this.Services.prompt.alert(win, "ZotPush MD", message);
  }
};
