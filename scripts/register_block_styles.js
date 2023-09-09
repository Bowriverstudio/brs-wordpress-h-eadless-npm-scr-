
const fs = require('fs');
const { getBrsConfig, camelCaseToTitleCase, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

// console.log(getBrsConfig().daisyui)

const config = getBrsConfig().wordpress.gutenbergBlocks;
const path = getProjectRoot() + config.source;
console.log(path)


function hasRegisterBlockStyles(directoryPath) {
    const directories = fs.readdirSync(directoryPath, { withFileTypes: true });
    const foundDirectories = [];
    const action = 'register_block_styles';

    for (const directory of directories) {
        if (directory.isDirectory()) {
            const directoryName = directory.name;
            const filePath = `${directoryPath}${directoryName}/register_block_styles.php`;

            if (fs.existsSync(filePath)) {
                foundDirectories.push(directoryName);
                uploadFile({ filePath, action, fileName: directoryName });
            }
        }
    }

    return foundDirectories;
}

const result = hasRegisterBlockStyles(path);
console.log(result);