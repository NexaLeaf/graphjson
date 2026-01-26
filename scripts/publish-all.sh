#!/bin/bash

# Publish all packages from libs/dist directories
echo "Publishing all packages to npm..."

ROOT_DIR=$(pwd)

for lib in libs/dist/*/; do
  lib_name=$(basename "$lib")
  if [ -f "$lib/package.json" ]; then
    echo ""
    echo "📦 Publishing $lib_name..."
    # Publish from root directory using --userconfig to ensure .npmrc is used
    npm publish "$lib" --access public --userconfig="$ROOT_DIR/.npmrc"
    echo "✓ Published $lib_name"
  fi
done

echo ""
echo "✅ All packages published successfully!"