# ZotPush MD

Plugin XPI per fare push degli elementi bibliografici selezionati da Zotero verso file Markdown autonomi con frontmatter YAML, note, annotazioni e immagini. I file possono essere usati con Obsidian o con qualsiasi altro strumento compatibile con Markdown.

Versione corrente: 0.5.2.

## Garanzia fondamentale

Il plugin non modifica item, note, annotazioni, tag, collezioni, allegati o database Zotero. Il flusso è esclusivamente `Zotero → file Markdown`. L'unica scrittura avviene nella cartella scelta dall'utente. `npm test` include un controllo statico delle API mutative vietate.

## Uso

Chi vuole esaminare il codice e costruire la XPI localmente può usare Node.js e npm:

```bash
git clone https://github.com/paolovolterra/Zotpush.git
cd Zotpush
npm test
npm run build
```

`npm test` esegue i test del formatter e l'audit statico delle chiamate mutative verso Zotero. `npm run build` crea la XPI corrispondente alla versione indicata in `package.json`. Il progetto non ha dipendenze npm da installare e non richiede `npm install`. L'audit è una verifica del sorgente fornito: leggere anche il codice se serve una valutazione indipendente.

In alternativa, scaricare la XPI già costruita dalla [release GitHub](https://github.com/paolovolterra/Zotpush/releases/tag/v0.5.2).

SHA-256 della XPI distribuita (`zotpush-md-0.5.2.xpi`):

```text
79e66b942d0abe93430715b6fdd18a98e6aec5fc0b84f7d6dae15f1050406c10
```

Verificarlo con `sha256sum zotpush-md-0.5.2.xpi` su Linux, `shasum -a 256 zotpush-md-0.5.2.xpi` su macOS o `Get-FileHash .\zotpush-md-0.5.2.xpi -Algorithm SHA256` in PowerShell. Il feed [updates.json](updates.json) contiene lo stesso hash. Una XPI costruita localmente può avere un hash diverso per i metadati dell'archivio ZIP: quello sopra identifica il file della release.

Ogni versione è archiviata anche su [Zenodo](https://doi.org/10.5281/zenodo.22901555), DOI `10.5281/zenodo.22901555` (rimanda sempre alla versione più recente). Il deposito contiene la XPI installabile e uno ZIP separato con sorgenti, test e script di compilazione; lo stesso ZIP è allegato alla release GitHub con il relativo SHA-256.

1. In Zotero: **Strumenti → Componenti aggiuntivi → ingranaggio → Installa componente aggiuntivo da file**.
2. Selezionare la XPI locale o quella scaricata.
3. Selezionare uno o più riferimenti bibliografici oppure i relativi PDF allegati; gli allegati vengono ricondotti automaticamente alla fonte bibliografica.
4. Usare **Strumenti → Push selezione in Markdown…** oppure fare clic destro sulla selezione e scegliere **Push selezione in Markdown…**.

Per estrarre soltanto alcune evidenze dalle fonti selezionate, usare **Push evidenze filtrate in Markdown…**. A differenza del push ordinario, questo comando riunisce tutte le fonti selezionate in un solo dossier `Evidenze Zotero - FILTRO.md`. Il filtro accetta:

- un nome di colore Zotero, per esempio `gray` (è accettato anche `grey`);
- il colore esadecimale, per esempio `#aaaaaa`;
- un tag dell'annotazione nel formato `tag:zlb-citazione`.

Il filtro proposto automaticamente è `tag:zlb-citazione`. Il confronto dei tag non distingue maiuscole e minuscole ed è esatto. Le fonti selezionate senza annotazioni corrispondenti vengono escluse dal dossier. Lasciando vuoto il filtro vengono esportate tutte le annotazioni. Ogni evidenza mantiene nel Markdown testo, commento, pagina, tutti i propri tag, collegamento Zotero e colore originale; vengono conservati anche gli altri tag della fonte e le sue note Zotero.

Con una sola fonte, il push ordinario crea il consueto file bibliografico. Con più fonti selezionate, le riunisce invece nel dossier unico `Fonti Zotero - selezione.md`, comprendendo abstract, note ed evidenze. Le riesportazioni sostituiscono YAML e blocco generato, preservando tutto ciò che segue il marcatore finale. Se un file omonimo non contiene i marcatori del plugin, l'esportazione si ferma senza sovrascriverlo.

Il file Markdown prende il nome dal titolo dell'elemento Zotero, ripulito dai caratteri non validi per il filesystem, seguito dalla chiave Zotero:

```text
Titolo Zotero - CHIAVE.md
```

## Limiti della versione 0.5.2

- Esporta solo gli elementi selezionati manualmente.
- La citation key viene letta dal campo disponibile o dalla riga `Citation Key:` di Extra (compatibile con Better BibTeX quando presente).
- Le immagini delle annotazioni già presenti nella cache locale vengono copiate in `assets/zotero-CHIAVE/` e incorporate con link Markdown relativi (`![](./assets/...)`), compatibili con Obsidian, anteprime Markdown e rendering HTML. Il plugin non forza la creazione della cache, perché scriverebbe nell'area dati Zotero.
- Compatibilità dichiarata: Zotero 9.0.x e Zotero 10.0.x. Test automatici e audit statico superati; la compatibilità nell'interfaccia di Zotero 10 richiede ancora prove su installazioni diverse.

## Rapporto con zlb

[zlb](https://github.com/paolovolterra/zotero-llm-bridge) cerca e importa PDF nella libreria tramite l'API locale di Zotero. ZotPush MD parte dalla libreria: esporta i riferimenti e le annotazioni selezionati verso Markdown. I due strumenti sono indipendenti e coprono passaggi diversi dello stesso flusso di studio.

ZotPush MD non trasmette contenuti della libreria e non contiene telemetria. Zotero può contattare GitHub per controllare gli aggiornamenti indicati in `updates.json`. La scrittura del plugin è limitata alla cartella Markdown scelta dall'utente; non modifica i dati Zotero.

## Migliorie pianificate

- Esportazione multipla resiliente: se un documento produce un errore, continuare con i successivi invece di interrompere l'intero gruppo.
- Riepilogo finale separato per file creati, aggiornati, ignorati e non esportati, con il motivo di ogni errore.
- Modalità opzionale per incorporare le immagini come Base64 nel Markdown. La modalità predefinita resta quella con file separati in `assets/`, più leggera, leggibile e adatta a Git.

## Sorgente e aggiornamenti

Il [repository GitHub](https://github.com/paolovolterra/Zotpush) è pubblico. Le release contengono la XPI installabile; `updates.json` indica a Zotero il file e l'hash SHA-256 della versione disponibile. La versione 0.5.2 è stata provata dal vivo in Zotero 10; con Zotero 9 la compatibilità è dichiarata ma non provata per questa versione. Segnalazioni e proposte possono essere aperte nelle [Issues](https://github.com/paolovolterra/Zotpush/issues).

## Sviluppo

La XPI è un normale archivio ZIP contenente `manifest.json`, `bootstrap.js` e `src/`. Per controllare il formatter e il vincolo di sola lettura:

```bash
npm test
```

## Licenza

ZotPush MD è software open source distribuito con licenza [MIT](LICENSE).
