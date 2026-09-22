# Log di sviluppo

## 2026-09-22

- Preparata la pubblicazione della versione 0.3.1 già presente nel worktree: supporto dichiarato a Zotero 9/10, immagini di annotazione con link Markdown relativi, test e audit sola lettura. Sostituiti gli URL provvisori del manifest con homepage e feed aggiornamenti GitHub; documentate installazione, privacy e complementarità con zlb. Su richiesta dell'utente, il README presenta per primo il build locale con `npm test` e `npm run build`, senza dipendenze npm. La verifica dal vivo nell'interfaccia di Zotero 10 resta distinta dai test automatici.
- Inserito lo SHA-256 dell'artefatto XPI 0.3.1 nel README, nell'annuncio community e in `updates.json`; il valore identifica il download della release, mentre il build locale può produrre uno ZIP con metadati diversi.

## 2026-08-26

- Scelto il nome definitivo **ZotPush MD**, che descrive il flusso `Zotero → Markdown` senza legare il plugin a Obsidian.
- Adottata la licenza open source MIT.

- Creato il plugin **Zotero → Obsidian (sola lettura)** per Zotero 9.0.x.
- Stabilito il vincolo fondamentale: nessuna modifica a item, note, annotazioni, tag, collezioni, allegati o database Zotero.
- Implementata l'esportazione unidirezionale degli elementi selezionati in file Markdown con frontmatter YAML.
- Esportati metadati bibliografici, citation key, collezioni, tag, note, evidenze e annotazioni.
- Aggiunti marcatori per aggiornare le sezioni generate preservando le note personali in Obsidian.
- Impedita la sovrascrittura di file omonimi non creati dal plugin.
- Implementata la copia nel vault delle immagini di annotazione già presenti nella cache locale Zotero.
- Aggiunti collegamenti agli elementi e alle annotazioni tramite URI `zotero://`.
- Corretta sul sistema Linux la registrazione GIO del gestore `x-scheme-handler/zotero` usato da Obsidian.
- Aggiunto **Esporta selezione in Obsidian…** sia al menu Strumenti sia al menu contestuale degli elementi.
- Aggiunti test del formatter, controllo sintattico e audit statico delle API mutative vietate.
- Ultima XPI prodotta: `dist/zotero-obsidian-readonly-0.2.1.xpi`.
- Confermato che il nome del Markdown deriva dal titolo dell'elemento Zotero e include la chiave Zotero per evitare collisioni: `Titolo Zotero - CHIAVE.md`.
- Confermato l'uso predefinito di immagini locali separate; annotata come possibile opzione futura l'incorporazione Base64 per ottenere un singolo Markdown autosufficiente, accettandone l'aumento di dimensione.
- Pianificata la futura pubblicazione del repository GitHub pubblico `zotpush-md`, con sorgenti, release XPI, aggiornamenti automatici e CI.
- Pianificato un annuncio early preview nei Zotero Forums dopo la pubblicazione del repository, per rendere verificabili codice, licenza e garanzia read-only.
- Salvata una bozza dell'annuncio community in `COMMUNITY_ANNOUNCEMENT.md`.
- Rinominato il plugin e il pacchetto in **ZotPush MD**; prodotta la versione `0.3.0` come `dist/zotpush-md-0.3.0.xpi`.
- Creato il repository GitHub privato `paolovolterra/Zotpush` con ramo predefinito `main`.
- Pubblicato il commit iniziale con sorgenti, test, audit read-only, documentazione, licenza MIT e bozza dell'annuncio community; gli artefatti `dist/` e le XPI restano esclusi da Git.

## 2026-08-28

- Verificato con quale strumento è stato costruito il plugin/XPI: **Codex CLI**, non Claude Code.
  - `~/.codex/sessions/2026/08/26/` — sessioni Codex del 26-ago citano il path `20260826_XPI/dist/zotero-obsidian-readonly-0.1.0.xpi` e la stringa "private repository Zotpush"; `~/.codex/history.jsonl` contiene 6 hit su `zotpush|xpi`. Stessa data dei commit (`3585ecf` 08:25, `127c21c` 09:12 del 26-ago).
  - La directory di sessione Claude Code `~/.claude/projects/-home-papo-notebooks-ClaudeCode-2026-202608-20260826-XPI/` è stata creata solo il 28-ago (prima sessione Claude Code su questo progetto = questa verifica).
  - I commit non hanno il trailer `Co-Authored-By: Claude` che Claude Code aggiunge quando committa.
- Resi esplicitamente relativi al Markdown i collegamenti alle immagini esportate: `./assets/zotero-CHIAVE/IMMAGINE.png`.
- Aggiornati il test del formatter e il README per documentare la scelta dei percorsi relativi; `npm test` e audit read-only superati.
- Ricostruita e verificata l'integrità di `dist/zotpush-md-0.3.0.xpi`.
- Creato `AGENTS.md` come contesto operativo persistente per le future sessioni Codex, con scopo, architettura, vincoli, comandi e stato del progetto.
- Verificato che i wikilink relativi `![[./assets/...]]` funzionano in Obsidian ma non nelle anteprime di code-server e nei rendering HTML; adottata quindi la sintassi Markdown portabile `![](./assets/...)`.

## 2026-08-29

- Estesa a Zotero 10.0.x la compatibilità dichiarata nel manifest, mantenendo Zotero 9.0.x come versione minima.
- Incrementata la versione del plugin a `0.3.1` e aggiornata la documentazione della compatibilità.

### Migliorie pianificate

- Rendere resiliente l'esportazione multipla: un errore su un documento non deve bloccare i successivi.
- Mostrare un riepilogo finale di file creati, aggiornati, ignorati e falliti, con le motivazioni.
- Aggiungere, eventualmente, una modalità immagini Base64 alternativa alla modalità `assets` predefinita.
