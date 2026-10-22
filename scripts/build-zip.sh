#!/usr/bin/env bash
# Builds the OpenAI plugin ZIP from an explicit allowlist, so scripts/, CI and
# the Claude-only files never reach the portal.
# Usage: scripts/build-zip.sh  ->  dist/ordinate-<version>.zip
set -euo pipefail

cd "$(dirname "$0")/.."

FILES=(plugin.json mcp.json assets README.md LICENSE)
version="$(node -p 'require("./plugin.json").version')"
out="dist/ordinate-${version}.zip"

mkdir -p dist
rm -f "$out"
zip -r -X -q "$out" "${FILES[@]}" -x '*.DS_Store'
echo "$out"
