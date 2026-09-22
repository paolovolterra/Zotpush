/* Pure formatting functions. This file intentionally has no Zotero write API. */
var ZoteroObsidianCore = (() => {
  "use strict";

  const START = "<!-- zotero-obsidian-readonly:start -->";
  const END = "<!-- zotero-obsidian-readonly:end -->";

  function text(value) {
    return String(value ?? "").replace(/\r\n?/g, "\n").trim();
  }

  function yamlString(value) {
    return JSON.stringify(text(value));
  }

  function yamlList(values, indent = 0) {
    const pad = " ".repeat(indent);
    const list = (values || []).map(text).filter(Boolean);
    return list.length ? "\n" + list.map(value => `${pad}  - ${yamlString(value)}`).join("\n") : " []";
  }

  function safeFilename(value, fallback = "senza-titolo") {
    const cleaned = text(value)
      .normalize("NFKC")
      .replace(/[\\/:*?\"<>|\u0000-\u001f]/g, "-")
      .replace(/\s+/g, " ")
      .replace(/[. ]+$/g, "")
      .slice(0, 140);
    return cleaned || fallback;
  }

  function htmlToMarkdown(value) {
    return text(value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function renderYAML(item, exportedAt) {
    const creators = (item.creators || []).map(c =>
      c.name || [c.firstName, c.lastName].filter(Boolean).join(" ")
    );
    const lines = [
      "---",
      `zotero_item_key: ${yamlString(item.key)}`,
      `zotero_library_id: ${yamlString(item.libraryID)}`,
      `citation_key: ${yamlString(item.citationKey)}`,
      `title: ${yamlString(item.title)}`,
      `authors:${yamlList(creators)}`,
      `date: ${yamlString(item.date)}`,
      `year: ${yamlString(item.year)}`,
      `item_type: ${yamlString(item.itemType)}`,
      `doi: ${yamlString(item.DOI)}`,
      `isbn: ${yamlString(item.ISBN)}`,
      `url: ${yamlString(item.url)}`,
      `collections:${yamlList(item.collections)}`,
      `tags:${yamlList(item.tags)}`,
      `zotero_uri: ${yamlString(item.zoteroURI)}`,
      `zotero_version: ${Number(item.version) || 0}`,
      `exported_at: ${yamlString(exportedAt)}`,
      "---"
    ];
    return lines.join("\n");
  }

  function renderGenerated(item) {
    const out = [START, `# ${text(item.title) || "Senza titolo"}`];
    if (item.zoteroURI) out.push(`[Apri elemento in Zotero](<${item.zoteroURI}>)`);
    if (item.abstract) out.push("## Abstract", text(item.abstract));
    if (item.notes?.length) {
      out.push("## Note Zotero");
      item.notes.forEach(note => out.push(`### Nota ${note.key}`, htmlToMarkdown(note.note)));
    }
    if (item.annotations?.length) {
      out.push("## Evidenze e annotazioni");
      item.annotations.forEach(annotation => {
        const page = annotation.pageLabel ? ` — p. ${annotation.pageLabel}` : "";
        const kind = annotation.type || "annotazione";
        out.push(`### ${kind}${page}`);
        if (annotation.text) out.push(`> ${text(annotation.text).replace(/\n/g, "\n> ")}`);
        if (annotation.comment) out.push(text(annotation.comment));
        if (annotation.imagePath) out.push(`![](${annotation.imagePath})`);
        else if (["image", "ink"].includes(annotation.type)) out.push("_Immagine non disponibile nella cache locale di Zotero._");
        if (annotation.tags?.length) out.push(`Tag: ${annotation.tags.map(t => `#${text(t).replace(/\s+/g, "-")}`).join(" ")}`);
        if (annotation.openURI) out.push(`[Apri in Zotero](<${annotation.openURI}>)`);
      });
    }
    out.push(END);
    return out.join("\n\n");
  }

  function merge(existing, item, exportedAt) {
    const generated = `${renderYAML(item, exportedAt)}\n\n${renderGenerated(item)}`;
    if (!existing) return `${generated}\n\n## Note personali\n`;
    const end = existing.indexOf(END);
    const start = existing.indexOf(START);
    if (start < 0 || end < start) {
      throw new Error("Il file esiste ma non contiene i marcatori del plugin; esportazione annullata per non sovrascriverlo.");
    }
    return generated + existing.slice(end + END.length);
  }

  return { START, END, safeFilename, htmlToMarkdown, renderYAML, renderGenerated, merge };
})();

if (typeof module !== "undefined") module.exports = ZoteroObsidianCore;
