# Annuncio community — bozza

Stato: da pubblicare nei Zotero Forums soltanto dopo l'apertura del repository pubblico e la creazione di una GitHub Release verificabile.

## Titolo

**[Early Preview] ZotPush MD — read-only push from Zotero to Markdown**

## Testo

ZotPush MD is a small open-source plugin for Zotero 9 that exports selected references directly to standalone Markdown files.

Unlike integrations initiated from a note-taking application, ZotPush MD follows a simple push model:

```text
Zotero → Markdown
```

It exports:

- YAML frontmatter and bibliographic metadata;
- notes, highlights and comments;
- cached image annotations as local assets;
- links back to Zotero items and annotations.

The plugin never modifies Zotero items, notes, tags, collections, attachments or the Zotero database. It writes only to the destination directory explicitly selected by the user. The repository includes automated tests and a static audit for prohibited mutating APIs.

Markdown files can be used with Obsidian, Logseq, Typora, Quarto, VS Code or any other Markdown-based workflow.

Current status: early preview for Zotero 9.0.x. Feedback on the YAML schema, annotation output and multi-item export workflow is welcome.

- License: MIT
- Source: `[GitHub repository URL]`
- XPI: `[GitHub Release URL]`
- Issues and feedback: `[GitHub Issues URL]`

## Prima della pubblicazione

- Sostituire tutti i segnaposto con URL reali.
- Verificare la XPI su Zotero 9 stabile.
- Pubblicare il security model read-only.
- Dichiarare l'assenza di telemetria e richieste di rete applicative.
- Aggiungere screenshot del menu contestuale e di un Markdown esportato.
- Indicare chiaramente i limiti della preview.
