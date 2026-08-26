#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
version="$(sed -n 's/.*"version": "\([^"]*\)".*/\1/p' "$project_dir/manifest.json" | head -1)"
mkdir -p "$project_dir/dist"
cd "$project_dir"
zip -q -r "dist/zotpush-md-${version}.xpi" manifest.json bootstrap.js src LICENSE
echo "dist/zotpush-md-${version}.xpi"
