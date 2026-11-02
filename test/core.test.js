const assert = require("node:assert/strict");
const core = require("../src/core.js");

const item = {
  key: "ABCD1234", libraryID: 1, version: 2, citationKey: "rossi2025",
  title: "Titolo: prova", creators: [{ firstName: "Mario", lastName: "Rossi" }],
  date: "2025", year: "2025", itemType: "journalArticle", DOI: "10.1/x",
  ISBN: "", url: "https://example.test", collections: ["Ricerca"], tags: ["evidenza"],
  zoteroURI: "zotero://select/library/items/ABCD1234", abstract: "Abstract",
  notes: [], annotations: [{
    type: "image", pageLabel: "3", imagePath: "./assets/zotero-ABCD1234/IMAGE01.png",
    color: "#aaaaaa", tags: ["zlb-citazione"],
    openURI: "zotero://open-pdf/library/items/PDFKEY01?page=3&annotation=IMAGE01"
  }, {
    type: "ink", pageLabel: "4",
    openURI: "zotero://open-pdf/library/items/PDFKEY01?page=4&annotation=INK01"
  }]
};

const first = core.merge("", item, "2026-08-26T00:00:00Z");
assert.match(first, /^---\nzotero_item_key: "ABCD1234"/);
assert.match(first, /title: "Titolo: prova"/);
assert.match(first, /## Note personali/);
assert.match(first, /!\[\]\(\.\/assets\/zotero-ABCD1234\/IMAGE01\.png\)/);
assert.match(first, /\[Apri in Zotero\]\(<zotero:\/\/open-pdf\/library\/items\/PDFKEY01\?page=3&annotation=IMAGE01>\)/);
assert.match(first, /Immagine non disponibile nella cache locale di Zotero/);
assert.match(first, /Colore Zotero: `#aaaaaa`/);

assert.equal(core.normalizeColor("gray"), "#aaaaaa");
assert.equal(core.normalizeColor("GREY"), "#aaaaaa");
assert.equal(core.annotationMatchesFilter(item.annotations[0], "gray"), true);
assert.equal(core.annotationMatchesFilter(item.annotations[0], "#AAAAAA"), true);
assert.equal(core.annotationMatchesFilter(item.annotations[0], "tag:zlb-citazione"), true);
assert.equal(core.annotationMatchesFilter(item.annotations[0], "tag:altro"), false);
assert.equal(core.annotationMatchesFilter(item.annotations[1], "gray"), false);
assert.equal(core.annotationMatchesFilter(item.annotations[1], ""), true);

const dossier = core.mergeEvidenceDossier("", [item], "gray", "2026-10-21T00:00:00Z");
assert.match(dossier, /title: "Evidenze Zotero"/);
assert.match(dossier, /source_count: 1/);
assert.match(dossier, /evidence_count: 2/);
assert.match(dossier, /## Titolo: prova/);
assert.match(dossier, /Tag fonte: #evidenza/);
assert.match(dossier, /Filtro: `gray`/);
assert.match(dossier, /## Note personali/);
const dossierUpdated = core.mergeEvidenceDossier(
  dossier + "\nNota dossier.\n", [item], "tag:zlb-citazione", "2026-10-22T00:00:00Z"
);
assert.match(dossierUpdated, /Nota dossier\./);
assert.match(dossierUpdated, /zotero_filter: "tag:zlb-citazione"/);
const fullDossier = core.renderEvidenceDossier(
  [{ ...item, notes: [{ key: "NOTE0001", note: "<p>Nota completa</p>" }] }],
  "", "2026-10-22T00:00:00Z", true
);
assert.match(fullDossier, /### Abstract\n\nAbstract/);
assert.match(fullDossier, /#### Nota NOTE0001\n\nNota completa/);
const notesDossier = core.renderEvidenceDossier(
  [{ ...item, abstract: "Da escludere", notes: [{ key: "NOTE0002", note: "Nota inclusa" }] }],
  "tag:zlb-citazione", "2026-10-22T00:00:00Z", false, true
);
assert.doesNotMatch(notesDossier, /Da escludere/);
assert.match(notesDossier, /#### Nota NOTE0002\n\nNota inclusa/);

const manual = first + "\nQuesta parte è mia.\n";
const updated = core.merge(manual, { ...item, title: "Titolo aggiornato" }, "2026-08-27T00:00:00Z");
assert.match(updated, /# Titolo aggiornato/);
assert.match(updated, /Questa parte è mia\./);
assert.throws(() => core.merge("contenuto estraneo", item, "ora"), /annullata/);
assert.equal(core.safeFilename('A/B: C?'), "A-B- C-");

console.log("Test core superati");
