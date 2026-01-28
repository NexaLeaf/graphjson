#!/bin/bash

# Interactive package selector and publisher

echo "🔨 Building all packages first..."
npx nx run-many -t build

echo ""
echo "📋 Copying package.json files..."
./scripts/copy-package-json.sh

echo ""
echo "📦 Select packages to publish (use space to select, enter to confirm):"
echo ""

# Get list of packages
packages=()
for lib in libs/dist/*/; do
  lib_name=$(basename "$lib")
  if [ -f "$lib/package.json" ]; then
    packages+=("$lib_name")
  fi
done

# Display packages with numbers
for i in "${!packages[@]}"; do
  printf "%2d) %s\n" $((i+1)) "${packages[$i]}"
done

echo ""
echo "Enter package numbers separated by spaces (e.g., 1 3 5) or 'all' for all packages:"
read -r selection

ROOT_DIR=$(pwd)
selected_packages=()

if [ "$selection" = "all" ]; then
  selected_packages=("${packages[@]}")
else
  # Parse selected numbers
  for num in $selection; do
    idx=$((num-1))
    if [ $idx -ge 0 ] && [ $idx -lt ${#packages[@]} ]; then
      selected_packages+=("${packages[$idx]}")
    fi
  done
fi

if [ ${#selected_packages[@]} -eq 0 ]; then
  echo "❌ No packages selected. Exiting."
  exit 1
fi

echo ""
echo "📦 Publishing ${#selected_packages[@]} package(s):"
for pkg in "${selected_packages[@]}"; do
  echo "  - $pkg"
done

echo ""
read -p "Proceed with publishing? (y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "❌ Publishing cancelled."
  exit 0
fi

echo ""
echo "📦 Publishing selected packages..."

for pkg in "${selected_packages[@]}"; do
  lib_path="libs/dist/$pkg"
  if [ -f "$lib_path/package.json" ]; then
    echo ""
    echo "📦 Publishing $pkg..."
    npm publish "$lib_path" --access public --userconfig="$ROOT_DIR/.npmrc"
    if [ $? -eq 0 ]; then
      echo "✅ Published $pkg"
    else
      echo "❌ Failed to publish $pkg"
    fi
  fi
done

echo ""
echo "✅ Publishing complete!"