#!/bin/bash

# Publish packages with automatic version bumping

echo "Select version bump type:"
echo "1) patch (0.0.1 → 0.0.2) - Bug fixes"
echo "2) minor (0.1.0 → 0.2.0) - New features"
echo "3) major (1.0.0 → 2.0.0) - Breaking changes"
echo ""
read -p "Enter choice (1-3): " bump_choice

case $bump_choice in
  1) BUMP_TYPE="patch" ;;
  2) BUMP_TYPE="minor" ;;
  3) BUMP_TYPE="major" ;;
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "🔨 Building all packages..."
npx nx run-many -t build

echo ""
echo "📋 Bumping version ($BUMP_TYPE) and copying package.json files..."

# Bump version for each package and copy to dist
for lib in libs/*/; do
  lib_name=$(basename "$lib")
  if [ -f "$lib/package.json" ] && [ -d "libs/dist/$lib_name" ]; then
    cd "$lib"
    npm version $BUMP_TYPE --no-git-tag-version
    cd ../..
    cp "$lib/package.json" "libs/dist/$lib_name/package.json"
    echo "✓ Bumped and copied $lib_name"
  fi
done

echo ""
echo "📦 Publishing all packages to npm..."

ROOT_DIR=$(pwd)

for lib in libs/dist/*/; do
  lib_name=$(basename "$lib")
  if [ -f "$lib/package.json" ]; then
    echo ""
    echo "📦 Publishing $lib_name..."
    npm publish "$lib" --access public --userconfig="$ROOT_DIR/.npmrc"
    if [ $? -eq 0 ]; then
      echo "✅ Published $lib_name"
    else
      echo "❌ Failed to publish $lib_name"
    fi
  fi
done

echo ""
echo "🏷️  Creating git commit and tags..."
git add libs/*/package.json
git commit -m "chore: bump versions ($BUMP_TYPE)"

# Create git tags for each package
for lib in libs/*/; do
  lib_name=$(basename "$lib")
  if [ -f "$lib/package.json" ]; then
    version=$(node -p "require('./$lib/package.json').version")
    pkg_name=$(node -p "require('./$lib/package.json').name")
    git tag "$pkg_name@$version"
  fi
done

echo ""
echo "✅ All packages published successfully!"
echo ""
echo "📌 Don't forget to push changes:"
echo "   git push origin main --follow-tags"