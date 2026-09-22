# Annuncio community — bozza

Stato: testo pronto per i Zotero Forums dopo la pubblicazione della release 0.3.1.

## Titolo

**[Early Preview] ZotPush MD — read-only push from Zotero to Markdown**

## Testo

ZotPush MD is a small open-source plugin for Zotero 9 and 10 that exports selected references directly to standalone Markdown files.

Unlike integrations initiated from a note-taking application, ZotPush MD follows a simple push model:

```text
Zotero → Markdown
```

It exports:

- YAML frontmatter and bibliographic metadata;
- notes, highlights and comments;
- cached image annotations as local assets;
- links back to Zotero items and annotations.

The plugin never modifies Zotero items, notes, tags, collections, attachments or the Zotero database. It writes only to the destination directory explicitly selected by the user. You can review the source, run `npm test` for formatter tests and a static audit of prohibited mutating APIs, then run `npm run build` to create the XPI locally. There are no npm dependencies to install.

Markdown files can be used with Obsidian, Logseq, Typora, Quarto, VS Code or any other Markdown-based workflow.

Current status: early preview for Zotero 9.0.x and 10.0.x. Feedback on the YAML schema, annotation output and multi-item export workflow is welcome.

- License: MIT
- Source: https://github.com/paolovolterra/Zotpush
- XPI: https://github.com/paolovolterra/Zotpush/releases/tag/v0.3.1
- XPI SHA-256: `b8ef61825b64896bc0f6282d94aacbc8fd2365910e4b8f3b85b99e99d2f73ec6`
- Issues and feedback: https://github.com/paolovolterra/Zotpush/issues

## Prima della pubblicazione

- Verificare la XPI nell'interfaccia di Zotero 9 e Zotero 10 stabili prima di dichiarare una compatibilità provata dal vivo.
- Pubblicare il security model read-only.
- Dichiarare l'assenza di telemetria e richieste di rete applicative.
- Aggiungere screenshot del menu contestuale e di un Markdown esportato.
- Indicare chiaramente i limiti della preview.
