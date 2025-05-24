#!/usr/bin/env bash

# Get the directory of this script
SOURCE_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Define the dist output directory
DIST_DIR="$SOURCE_DIR/../dist"

# Ensure the dist directory exists
mkdir -p "$DIST_DIR"

# Copy run.sh to the dist directory
cp "$SOURCE_DIR/run.sh" "$DIST_DIR"

# Go to the root of the project and pack
pushd "$SOURCE_DIR/.." > /dev/null

# Create the npm package
npm pack

# Rename and move the package to dist
mv create-scalable-react-app*.tgz "$DIST_DIR/create-scalable-react-app.tgz"

# Return to the original directory
popd > /dev/null
