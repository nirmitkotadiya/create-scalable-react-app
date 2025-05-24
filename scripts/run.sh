#!/usr/bin/env bash

# Check if a URL was provided
if [ "$#" -ne 1 ]; then
    echo "❌ Invalid command line arguments."
    echo "✅ Usage: ./run.sh <URL-to-create-scalable-react-app.tgz>"
    exit 1
fi

PACKAGE_URL="$1"
TEMP_DIR="$(mktemp -d)"

# Download the package
curl -fsSL "$PACKAGE_URL" -o "$TEMP_DIR/package.tgz"

# Navigate to the temp directory
pushd "$TEMP_DIR" > /dev/null

# Install the package
npm install package.tgz

# Run the CLI
npx --prefix="$TEMP_DIR" create-scalable-react-app

# Cleanup
popd > /dev/null
rm -rf "$TEMP_DIR"
