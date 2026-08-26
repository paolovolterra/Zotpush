# Log di sviluppo

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

### Migliorie pianificate

- Rendere resiliente l'esportazione multipla: un errore su un documento non deve bloccare i successivi.
- Mostrare un riepilogo finale di file creati, aggiornati, ignorati e falliti, con le motivazioni.
- Aggiungere, eventualmente, una modalità immagini Base64 alternativa alla modalità `assets` predefinita.
