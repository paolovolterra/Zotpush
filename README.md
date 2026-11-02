# ZotPush MD

**English** · [Italiano](README.it.md)

A Zotero plugin (XPI) that pushes selected bibliographic items from Zotero to standalone Markdown files with YAML frontmatter, notes, annotations and images. The files work with Obsidian or any other Markdown tool.

Current version: 0.5.2 ([release](https://github.com/paolovolterra/Zotpush/releases/tag/v0.5.2), [Zenodo](https://doi.org/10.5281/zenodo.23875777)).

## What's new in 0.5.2

- **Filtered evidence export** (*Push evidenze filtrate in Markdown…*): a new command that extracts from the selected sources only the annotations of a given colour (`gray`, `#aaaaaa`) or with a given tag (`tag:zlb-citazione`, the default filter), and collects them in a single dossier, `Evidenze Zotero - FILTRO.md`.
- **One dossier for multiple selections**: pushing several sources at once produces `Fonti Zotero - selezione.md`, with the abstracts, notes and annotations of all of them; a single source still gets its own file.
- **More flexible selection**: if you select a PDF, a note or an annotation, ZotPush finds the parent bibliographic item; duplicate sources are exported only once.
- **Context preserved**: colour, tags, page, `zotero://` link and comment of each annotation, plus the source's own tags and Zotero notes.
- **Reliable menus**: the commands appear both in the Tools menu and in the right-click menu, registered independently.
- Tested live in Zotero 10; the read-only guarantee towards Zotero is unchanged.

## Core guarantee

The plugin never modifies Zotero items, notes, annotations, tags, collections, attachments or the Zotero database. Data flows one way only: `Zotero → Markdown files`. The only writes go to the folder chosen by the user. `npm test` includes a static check for forbidden mutating API calls.

## Build from source

To review the code and build the XPI locally, use Node.js and npm:

```bash
git clone https://github.com/paolovolterra/Zotpush.git
cd Zotpush
npm test
npm run build
```

`npm test` runs the formatter tests and the static audit for mutating Zotero calls. `npm run build` creates the XPI for the version set in `package.json`. The project has no npm dependencies and does not need `npm install`. The audit checks the source as provided: read the code too if you need an independent assessment.

Alternatively, download the prebuilt XPI from the [GitHub release](https://github.com/paolovolterra/Zotpush/releases/tag/v0.5.2).

SHA-256 of the distributed XPI (`zotpush-md-0.5.2.xpi`):

```text
79e66b942d0abe93430715b6fdd18a98e6aec5fc0b84f7d6dae15f1050406c10
```

Check it with `sha256sum zotpush-md-0.5.2.xpi` on Linux, `shasum -a 256 zotpush-md-0.5.2.xpi` on macOS or `Get-FileHash .\zotpush-md-0.5.2.xpi -Algorithm SHA256` in PowerShell. The [updates.json](updates.json) feed carries the same hash. A locally built XPI may have a different hash because of ZIP archive metadata: the hash above identifies the release file.

Every version is also archived on [Zenodo](https://doi.org/10.5281/zenodo.22901555), DOI `10.5281/zenodo.22901555` (always resolves to the latest version). The deposit contains the installable XPI and a separate ZIP with sources, tests and build scripts; the same ZIP is attached to the GitHub release with its SHA-256.

## Usage

The plugin's menu labels are in Italian; English translations are given in brackets.

1. In Zotero: **Tools → Plugins → gear icon → Install Plugin From File…**.
2. Select the local or downloaded XPI.
3. Select one or more bibliographic items, or their PDF attachments; attachments are automatically traced back to the parent item.
4. Use **Tools → Push selezione in Markdown…** (*Push selection to Markdown*) or right-click the selection and choose **Push selezione in Markdown…**.

To extract only some annotations from the selected sources, use **Push evidenze filtrate in Markdown…** (*Push filtered evidence to Markdown*). Unlike the ordinary push, this command gathers all selected sources into a single dossier, `Evidenze Zotero - FILTRO.md`. The filter accepts:

- a Zotero colour name, for example `gray` (`grey` is also accepted);
- the hexadecimal colour, for example `#aaaaaa`;
- an annotation tag, written as `tag:zlb-citazione`.

The suggested default filter is `tag:zlb-citazione`. Tag matching is exact and case-insensitive. Selected sources with no matching annotations are left out of the dossier. An empty filter exports all annotations. Each annotation keeps its text, comment, page, all its tags, Zotero link and original colour in the Markdown; the source's other tags and its Zotero notes are kept as well.

With a single source, the ordinary push creates the usual bibliographic file. With several sources selected, it merges them into one dossier, `Fonti Zotero - selezione.md`, including abstracts, notes and annotations. Re-exports replace the YAML and the generated block, keeping everything after the end marker. If a file with the same name lacks the plugin's markers, the export stops without overwriting it.

The Markdown file is named after the Zotero item title, cleaned of characters that are invalid in file names, followed by the Zotero key:

```text
Zotero Title - KEY.md
```

## Limitations of version 0.5.2

- Exports only manually selected items.
- The citation key is read from the available field or from the `Citation Key:` line in Extra (compatible with Better BibTeX when present).
- Annotation images already in Zotero's local cache are copied to `assets/zotero-KEY/` and embedded with relative Markdown links (`![](./assets/...)`), which work in Obsidian, Markdown previews and HTML rendering. The plugin does not force the cache to be created, because that would write to Zotero's data area.
- Declared compatibility: Zotero 9.0.x and Zotero 10.0.x. Automated tests and the static audit pass; 0.5.2 was tested live in Zotero 10, while it has not been tested live in Zotero 9 for this version.

## Relation to zlb

[zlb](https://github.com/paolovolterra/zotero-llm-bridge) searches for PDFs and imports them into the library through Zotero's local API. ZotPush MD starts from the library: it exports the selected items and annotations to Markdown. The two tools are independent and cover different steps of the same research workflow.

ZotPush MD does not transmit library content and contains no telemetry. Zotero may contact GitHub to check for updates listed in `updates.json`. The plugin writes only to the Markdown folder chosen by the user; it does not modify Zotero data.

## Planned improvements

- Resilient batch export: if one document fails, continue with the next ones instead of stopping the whole batch.
- A final summary listing files created, updated, skipped and not exported, with the reason for each failure.
- An optional mode that embeds images in the Markdown as Base64. The default stays separate files in `assets/`, which are lighter, more readable and Git-friendly.

## Source and updates

The [GitHub repository](https://github.com/paolovolterra/Zotpush) is public. Releases contain the installable XPI; `updates.json` tells Zotero which file is available and its SHA-256 hash. Version 0.5.2 was tested live in Zotero 10; Zotero 9 compatibility is declared but was not tested live for this version. Bug reports and suggestions are welcome in [Issues](https://github.com/paolovolterra/Zotpush/issues).

## Development

The XPI is a plain ZIP archive containing `manifest.json`, `bootstrap.js` and `src/`. To check the formatter and the read-only guarantee:

```bash
npm test
```

## License

ZotPush MD is open source software released under the [MIT](LICENSE) license.
