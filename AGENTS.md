# Contesto operativo — ZotPush MD

## Progetto

**ZotPush MD** è un plugin XPI open source (MIT) per Zotero 9.0.x e 10.0.x. Esporta gli elementi bibliografici selezionati da Zotero verso file Markdown utilizzabili in Obsidian o in altri editor Markdown.

Il flusso è esclusivamente:

```text
Zotero → Markdown
```

Il vincolo fondamentale è **non modificare mai Zotero**: niente scritture su item, note, annotazioni, tag, collezioni, allegati o database. Ogni modifica al codice deve mantenere questo vincolo e superare l'audit statico.

## Comportamento attuale

- Esporta metadati bibliografici in frontmatter YAML.
- Esporta abstract, note, evidenze, annotazioni, tag e collezioni.
- Aggiunge URI `zotero://` per aprire item e annotazioni.
- Genera file denominati `Titolo Zotero - CHIAVE.md`.
- Delimita il contenuto rigenerabile con marcatori HTML e preserva le note personali successive.
- Non sovrascrive file omonimi privi dei marcatori del plugin.
- Copia le immagini già presenti nella cache locale Zotero in `assets/zotero-CHIAVE/`.
- Nei Markdown incorpora le immagini con sintassi Markdown standard e percorsi esplicitamente relativi: `![](./assets/zotero-CHIAVE/IMMAGINE.png)`. I wikilink `![[...]]` funzionano in Obsidian ma non nelle anteprime di code-server e nei rendering HTML, quindi non usarli per le immagini esportate. Non introdurre percorsi assoluti.

## Struttura essenziale

- `src/plugin.js`: integrazione con Zotero, lettura degli item, selezione della cartella e scrittura dei file.
- `src/core.js`: funzioni pure per rendering YAML/Markdown e aggiornamento sicuro del contenuto generato.
- `bootstrap.js`: ciclo di vita del plugin.
- `test/core.test.js`: test del formatter e della conservazione delle note personali.
- `scripts/audit-readonly.sh`: rileva possibili chiamate mutative verso Zotero.
- `scripts/build.sh`: crea la XPI in `dist/`.
- `README.md`: documentazione per l'utente.
- `LOG.md`: cronologia e decisioni di sviluppo.

## Comandi di verifica

Eseguire dopo ogni modifica al codice:

```bash
npm test
```

Il comando esegue i test del core e l'audit read-only. Per costruire il pacchetto:

```bash
npm run build
```

La versione corrente è `0.3.1`; l'artefatto risultante è `dist/zotpush-md-0.3.1.xpi`. La directory `dist/` e le XPI non sono versionate in Git.

## Preferenze e cautele

- Preferire link relativi per immagini e altre risorse locali.
- Preservare sempre il contenuto scritto manualmente dall'utente nei Markdown esportati.
- Non forzare la creazione della cache immagini di Zotero, perché ciò scriverebbe nell'area dati Zotero.
- Non modificare o eliminare cambiamenti già presenti nel worktree che non appartengono al compito corrente.
- Mantenere compatibilità con Zotero 9.0.x e 10.0.x finché le versioni dichiarate nel manifest non cambiano.
- Aggiornare `updates.json` e il suo SHA-256 quando si pubblica una nuova XPI.

## Stato e sviluppi previsti

Il repository pubblico è `paolovolterra/Zotpush`, ramo `main`. Tra le migliorie pianificate: esportazione multipla resiliente, riepilogo dettagliato dei risultati e possibile modalità Base64 opzionale per le immagini. Per la cronologia completa consultare `LOG.md`.
