var ZoteroObsidianReadonly;
var pluginRootURI;

async function startup({ rootURI }) {
  await Zotero.initializationPromise;
  pluginRootURI = rootURI;
  Services.scriptloader.loadSubScript(rootURI + "src/core.js");
  Services.scriptloader.loadSubScript(rootURI + "src/plugin.js");
  ZoteroObsidianReadonly = new ZoteroObsidianReadonlyPlugin(
    Zotero,
    Services,
    ZoteroObsidianCore
  );
  ZoteroObsidianReadonly.start();
}

function shutdown() {
  ZoteroObsidianReadonly?.stop();
  ZoteroObsidianReadonly = null;
  pluginRootURI = null;
}

function install() {}
function uninstall() {}

function onMainWindowLoad({ window }) {
  ZoteroObsidianReadonly?.addToWindow(window);
}

function onMainWindowUnload({ window }) {
  ZoteroObsidianReadonly?.removeFromWindow(window);
}
