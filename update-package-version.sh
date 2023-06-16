#!/bin/bash

# Define the path to the package.json file
PACKAGE_PATH="./package.json"

# Extract the current version number from the package.json file
version=$(grep -oE '"version": "\d+\.\d+\.\d+"' $PACKAGE_PATH | grep -oE '\d+\.\d+\.\d+')
echo "Current version: $version"

IFS='.' read -a version_array <<< "$version"

# Increase the patch number (last element of the array) by 1
version_array[2]=$((version_array[2]+1))

# Join the version array back into a string using the dot as a separator
new_version="${version_array[0]}.${version_array[1]}.${version_array[2]}"

# Replace the old version string with the new version string in the file
# On MacOS
sed -i '' "s/$version/$new_version/g" $PACKAGE_PATH
# On Linux
# sed -i "s/$version/$new_version/g" $PACKAGE_PATH

# Print the new version number
echo "New version: $new_version"
