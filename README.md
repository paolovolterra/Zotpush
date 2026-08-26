# ZotPush MD

Plugin XPI per fare push degli elementi bibliografici selezionati da Zotero verso file Markdown autonomi con frontmatter YAML, note, annotazioni e immagini. I file possono essere usati con Obsidian o con qualsiasi altro strumento compatibile con Markdown.

Versione corrente: 0.3.0.

## Garanzia fondamentale

Il plugin non modifica item, note, annotazioni, tag, collezioni, allegati o database Zotero. Il flusso è esclusivamente `Zotero → file Markdown`. L'unica scrittura avviene nella cartella scelta dall'utente. `npm test` include un controllo statico delle API mutative vietate.

## Uso

1. Costruire la XPI con `npm run build`.
2. In Zotero: **Strumenti → Componenti aggiuntivi → ingranaggio → Installa componente aggiuntivo da file**.
3. Selezionare la XPI in `dist/`.
4. Selezionare uno o più riferimenti bibliografici.
5. Usare **Strumenti → Push selezione in Markdown…** oppure fare clic destro sulla selezione e scegliere **Push selezione in Markdown…**.

Il nome del file include la chiave Zotero per evitare collisioni. Le riesportazioni sostituiscono YAML e blocco generato, preservando tutto ciò che segue il marcatore finale. Se un file omonimo non contiene i marcatori del plugin, l'esportazione si ferma senza sovrascriverlo.

Il file Markdown prende il nome dal titolo dell'elemento Zotero, ripulito dai caratteri non validi per il filesystem, seguito dalla chiave Zotero:

```text
Titolo Zotero - CHIAVE.md
```

## Limiti della versione 0.1.0

- Esporta solo gli elementi selezionati manualmente.
- La citation key viene letta dal campo disponibile o dalla riga `Citation Key:` di Extra (compatibile con Better BibTeX quando presente).
- Le immagini delle annotazioni già presenti nella cache locale vengono copiate in `assets/zotero-CHIAVE/`. Il plugin non forza la creazione della cache, perché scriverebbe nell'area dati Zotero.
- Compatibilità dichiarata: Zotero 9.0.x (incluso Zotero 9.0.4).

## Migliorie pianificate

- Esportazione multipla resiliente: se un documento produce un errore, continuare con i successivi invece di interrompere l'intero gruppo.
- Riepilogo finale separato per file creati, aggiornati, ignorati e non esportati, con il motivo di ogni errore.
- Modalità opzionale per incorporare le immagini come Base64 nel Markdown. La modalità predefinita resta quella con file separati in `assets/`, più leggera, leggibile e adatta a Git.

## Pubblicazione pianificata

- Aprire un repository GitHub pubblico denominato `zotpush-md`.
- Sostituire nel manifest gli URL provvisori con homepage e `updates.json` reali.
- Pubblicare sorgenti e XPI tramite GitHub Releases.
- Automatizzare test, audit read-only, build e verifica della XPI con GitHub Actions.
- Aggiungere icona, screenshot, privacy statement, security model, changelog e istruzioni per contribuire.
- Annunciare una early preview nei Zotero Forums soltanto dopo la disponibilità del repository pubblico e di una release verificabile.
- Conservare la licenza MIT e dichiarare esplicitamente assenza di telemetria e scritture verso Zotero.

## Sviluppo

La XPI è un normale archivio ZIP contenente `manifest.json`, `bootstrap.js` e `src/`. Per controllare il formatter e il vincolo di sola lettura:

```bash
npm test
```

## Licenza

ZotPush MD è software open source distribuito con licenza [MIT](LICENSE).
