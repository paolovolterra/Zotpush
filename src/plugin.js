/* global ZoteroObsidianCore, Cc, Ci */
var ZoteroObsidianReadonlyPlugin = class ZoteroObsidianReadonlyPlugin {
  constructor(ZoteroAPI, ServicesAPI, core) {
    this.Zotero = ZoteroAPI;
    this.Services = ServicesAPI;
    this.core = core;
    this.toolsMenuID = "zotero-obsidian-readonly-export-tools";
    this.contextMenuID = "zotero-obsidian-readonly-export-context";
    this.filteredToolsMenuID = "zotero-obsidian-readonly-filtered-tools";
    this.filteredContextMenuID = "zotero-obsidian-readonly-filtered-context";
    this.windows = new Set();
  }

  start() {
    for (const win of this.Zotero.getMainWindows()) this.addToWindow(win);
  }

  stop() {
    for (const win of this.windows) this.removeFromWindow(win);
  }

  addToWindow(win) {
    if (!win) return;
    const popup = win.document.getElementById("menu_ToolsPopup");
    if (popup && !win.document.getElementById(this.toolsMenuID)) {
      const item = win.document.createXULElement("menuitem");
      item.id = this.toolsMenuID;
      item.setAttribute("label", "Push selezione in Markdown…");
      item.addEventListener("command", () => this.exportSelection(win));
      popup.appendChild(item);
    }
    if (popup && !win.document.getElementById(this.filteredToolsMenuID)) {
      const filteredItem = win.document.createXULElement("menuitem");
      filteredItem.id = this.filteredToolsMenuID;
      filteredItem.setAttribute("label", "Push evidenze filtrate in Markdown…");
      filteredItem.addEventListener("command", () => this.exportFilteredSelection(win));
      popup.appendChild(filteredItem);
    }

    const contextPopup = win.document.getElementById("zotero-itemmenu");
    if (contextPopup && !win.document.getElementById(this.contextMenuID)) {
      const contextItem = win.document.createXULElement("menuitem");
      contextItem.id = this.contextMenuID;
      contextItem.setAttribute("label", "Push selezione in Markdown…");
      contextItem.addEventListener("command", () => this.exportSelection(win));
      contextPopup.appendChild(contextItem);

      const filteredContextItem = win.document.createXULElement("menuitem");
      filteredContextItem.id = this.filteredContextMenuID;
      filteredContextItem.setAttribute("label", "Push evidenze filtrate in Markdown…");
      filteredContextItem.addEventListener("command", () => this.exportFilteredSelection(win));
      const updateVisibility = () => {
        const hasExportableItem = this.resolveSelectedRegularItems(win).length > 0;
        contextItem.hidden = !hasExportableItem;
        filteredContextItem.hidden = !hasExportableItem;
      };
      contextItem._zoteroObsidianPopupHandler = updateVisibility;
      filteredContextItem._zoteroObsidianPopupHandler = updateVisibility;
      contextPopup.addEventListener("popupshowing", updateVisibility);
      contextPopup.appendChild(filteredContextItem);
    }
    this.windows.add(win);
  }

  removeFromWindow(win) {
    win?.document.getElementById(this.toolsMenuID)?.remove();
    win?.document.getElementById(this.filteredToolsMenuID)?.remove();
    const contextItem = win?.document.getElementById(this.contextMenuID);
    const contextPopup = win?.document.getElementById("zotero-itemmenu");
    if (contextItem?._zoteroObsidianPopupHandler) {
      contextPopup?.removeEventListener(
        "popupshowing",
        contextItem._zoteroObsidianPopupHandler
      );
    }
    contextItem?.remove();
    const filteredContextItem = win?.document.getElementById(this.filteredContextMenuID);
    if (filteredContextItem?._zoteroObsidianPopupHandler) {
      contextPopup?.removeEventListener(
        "popupshowing",
        filteredContextItem._zoteroObsidianPopupHandler
      );
    }
    filteredContextItem?.remove();
    this.windows.delete(win);
  }

  async chooseDirectory(win) {
    const picker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    picker.init(win.browsingContext, "Scegli la cartella di destinazione Markdown", Ci.nsIFilePicker.modeGetFolder);
    const result = await new Promise(resolve => picker.open(resolve));
    if (result !== Ci.nsIFilePicker.returnOK) return null;
    return picker.file.path;
  }

  chooseAnnotationFilter(win) {
    const input = { value: "tag:zlb-citazione" };
    const accepted = this.Services.prompt.prompt(
      win,
      "ZotPush MD — filtro evidenze",
      "Inserisci un colore (gray o #aaaaaa) oppure tag:nome. Lascia vuoto per tutte.",
      input,
      null,
      {}
    );
    return accepted ? input.value.trim() : null;
  }

  async exportFilteredSelection(win) {
    const filter = this.chooseAnnotationFilter(win);
    if (filter === null) return;
    await this.exportEvidenceDossier(win, filter);
  }

  resolveRegularItem(item) {
    let current = item;
    const visited = new Set();
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      if (current.isRegularItem()) return current;
      const parentID = current.parentItemID || current.getSource?.();
      if (!parentID) return null;
      current = this.Zotero.Items.get(parentID);
    }
    return null;
  }

  resolveSelectedRegularItems(win) {
    const byID = new Map();
    for (const selected of win.ZoteroPane.getSelectedItems()) {
      const regularItem = this.resolveRegularItem(selected);
      if (regularItem) byID.set(regularItem.id, regularItem);
    }
    return [...byID.values()];
  }

  async exportSelection(win, annotationFilter = "") {
    try {
      const selected = this.resolveSelectedRegularItems(win);
      if (!selected.length) {
        this.alert(win, "Seleziona almeno una fonte bibliografica oppure un suo PDF allegato.");
        return;
      }
      const directory = await this.chooseDirectory(win);
      if (!directory) return;
      if (selected.length > 1) {
        const models = [];
        for (const item of selected) models.push(await this.readItem(item, annotationFilter));
        await this.writeEvidenceDossier(directory, models, annotationFilter, {
          filename: "Fonti Zotero - selezione.md",
          includeSourceContent: true
        });
        this.alert(
          win,
          `Un dossier Markdown esportato con ${models.length} fonti. Zotero non è stato modificato.`
        );
        return;
      }
      let count = 0;
      for (const item of selected) {
        const model = await this.readItem(item, annotationFilter);
        await this.writeMarkdown(directory, model);
        count++;
      }
      const filterMessage = annotationFilter ? ` Filtro evidenze: ${annotationFilter}.` : "";
      this.alert(win, `${count} file Markdown esportati.${filterMessage} Zotero non è stato modificato.`);
    } catch (error) {
      this.Zotero.logError(error);
      this.alert(win, `Esportazione non riuscita:\n${error.message}`);
    }
  }

  async exportEvidenceDossier(win, annotationFilter) {
    try {
      const selected = this.resolveSelectedRegularItems(win);
      if (!selected.length) {
        this.alert(win, "Seleziona almeno una fonte bibliografica oppure un suo PDF allegato.");
        return;
      }
      const directory = await this.chooseDirectory(win);
      if (!directory) return;
      const models = [];
      for (const item of selected) models.push(await this.readItem(item, annotationFilter));
      const matchingModels = models.filter(model => model.annotations.length > 0);
      const evidenceCount = matchingModels.reduce((sum, model) => sum + model.annotations.length, 0);
      if (!evidenceCount) {
        this.alert(win, `Nessuna evidenza corrisponde al filtro ${annotationFilter || "selezionato"}.`);
        return;
      }
      await this.writeEvidenceDossier(directory, matchingModels, annotationFilter, {
        includeNotes: true
      });
      this.alert(
        win,
        `Un dossier Markdown esportato: ${evidenceCount} evidenze da ${matchingModels.length} fonti. ` +
        `Filtro: ${annotationFilter || "tutte"}. Zotero non è stato modificato.`
      );
    } catch (error) {
      this.Zotero.logError(error);
      this.alert(win, `Esportazione non riuscita:\n${error.message}`);
    }
  }

  async readItem(item, annotationFilter = "") {
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
          color: data.annotationColor,
          pageLabel,
          tags: annotation.getTags().map(tag => tag.tag),
          imageSourcePath,
          openURI: `zotero://open-pdf/${libraryPrefix}/items/${attachment.key}` +
            `?page=${encodeURIComponent(pageLabel || 1)}&annotation=${annotation.key}`
        });
      }
    }
    const filteredAnnotations = annotations.filter(annotation =>
      this.core.annotationMatchesFilter(annotation, annotationFilter)
    );
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
      annotations: filteredAnnotations,
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

  async copyAnnotationImages(directory, model) {
    const assetRelativeDir = `./assets/zotero-${model.key}`;
    const assetDir = PathUtils.join(directory, "assets", `zotero-${model.key}`);
    for (const annotation of model.annotations) {
      if (!annotation.imageSourcePath) continue;
      await IOUtils.makeDirectory(assetDir, { createAncestors: true, ignoreExisting: true });
      const imageName = `${annotation.key}.png`;
      await IOUtils.copy(
        annotation.imageSourcePath,
        PathUtils.join(assetDir, imageName),
        { noOverwrite: false }
      );
      annotation.imagePath = `${assetRelativeDir}/${imageName}`;
    }
  }

  async writeEvidenceDossier(directory, models, annotationFilter, options = {}) {
    for (const model of models) await this.copyAnnotationImages(directory, model);
    const filterName = this.core.safeFilename(annotationFilter || "tutte", "tutte");
    const filename = options.filename || `Evidenze Zotero - ${filterName}.md`;
    const path = PathUtils.join(directory, filename);
    let existing = "";
    if (await IOUtils.exists(path)) existing = await IOUtils.readUTF8(path);
    const output = this.core.mergeEvidenceDossier(
      existing,
      models,
      annotationFilter,
      new Date().toISOString(),
      Boolean(options.includeSourceContent),
      Boolean(options.includeNotes)
    );
    await IOUtils.writeUTF8(path, output, { tmpPath: path + ".tmp" });
  }

  alert(win, message) {
    this.Services.prompt.alert(win, "ZotPush MD", message);
  }
};
