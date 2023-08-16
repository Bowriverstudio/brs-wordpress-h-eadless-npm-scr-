// Import required modules
const fs = require('fs-extra');
const path = require('path');
const { getBrsConfig, getProjectRoot, copyDirRecursive } = require('brs-wordpress-headless-npm-scripts/utils');


const sourceDirPaths = {
    stories: path.join(__dirname, '../stories'),
    assets: path.join(__dirname, '../assets')
}

const destinationDirPaths = {
    stories: path.join(getProjectRoot(), getBrsConfig().storybook.destination),
    assets: path.join(getProjectRoot(), 'public/brs')
}

// Loop through both source and destination directory paths
Object.entries(sourceDirPaths).forEach(([sourceType, sourceDir]) => {
    const destinationDir = destinationDirPaths[sourceType];

    // Ensure the destination directory exists
    fs.ensureDirSync(destinationDir);

    // Copy the source directory to the destination directory
    copyDirRecursive(sourceDir, destinationDir);
});

console.log('Copy completed successfully.');
