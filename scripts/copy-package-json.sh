#!/bin/bash

# Copy package.json files from libs to libs/dist directory
for lib in libs/*/; do
  lib_name=$(basename "$lib")
  if [ -f "$lib/package.json" ] && [ -d "libs/dist/$lib_name" ]; then
    cp "$lib/package.json" "libs/dist/$lib_name/package.json"
    echo "✓ Copied package.json for $lib_name"
  fi
done

echo "✓ All package.json files copied!"