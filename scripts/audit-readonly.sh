#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
forbidden='\.(save|saveTx|erase|eraseTx|setField|setNote|setTags|addTag|removeTag|addToCollection|removeFromCollection)[[:space:]]*\(|Zotero\.DB\.(query|executeTransaction)|UPDATE[[:space:]]|INSERT[[:space:]]|DELETE[[:space:]]'
if rg -n -i "$forbidden" bootstrap.js src; then
  echo "ERRORE: trovata una possibile operazione mutativa verso Zotero" >&2
  exit 1
fi
echo "Audit sola lettura superato"
