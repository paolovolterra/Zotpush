const assert = require("node:assert/strict");
const core = require("../src/core.js");

const item = {
  key: "ABCD1234", libraryID: 1, version: 2, citationKey: "rossi2025",
  title: "Titolo: prova", creators: [{ firstName: "Mario", lastName: "Rossi" }],
  date: "2025", year: "2025", itemType: "journalArticle", DOI: "10.1/x",
  ISBN: "", url: "https://example.test", collections: ["Ricerca"], tags: ["evidenza"],
  zoteroURI: "zotero://select/library/items/ABCD1234", abstract: "Abstract",
  notes: [], annotations: [{
    type: "image", pageLabel: "3", imagePath: "assets/zotero-ABCD1234/IMAGE01.png",
    openURI: "zotero://open-pdf/library/items/PDFKEY01?page=3&annotation=IMAGE01"
  }]
};

const first = core.merge("", item, "2026-08-26T00:00:00Z");
assert.match(first, /^---\nzotero_item_key: "ABCD1234"/);
assert.match(first, /title: "Titolo: prova"/);
assert.match(first, /## Note personali/);
assert.match(first, /!\[\[assets\/zotero-ABCD1234\/IMAGE01\.png\]\]/);
assert.match(first, /\[Apri in Zotero\]\(<zotero:\/\/open-pdf\/library\/items\/PDFKEY01\?page=3&annotation=IMAGE01>\)/);

const manual = first + "\nQuesta parte è mia.\n";
const updated = core.merge(manual, { ...item, title: "Titolo aggiornato" }, "2026-08-27T00:00:00Z");
assert.match(updated, /# Titolo aggiornato/);
assert.match(updated, /Questa parte è mia\./);
assert.throws(() => core.merge("contenuto estraneo", item, "ora"), /annullata/);
assert.equal(core.safeFilename('A/B: C?'), "A-B- C-");

console.log("Test core superati");
