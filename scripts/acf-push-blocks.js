const fs = require('fs');
const path = require('path');
const { getBrsConfig, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

const source = getBrsConfig().acf.source;
const acfDirectory = path.join(getProjectRoot(), source);

// Using synchronous readdir and stat to simplify the example.
// In production code, consider using async/await with promisify.
fs.readdirSync(acfDirectory).forEach(folder => {
    let fullFolderPath = path.join(acfDirectory, folder);

    // Check if it's a directory
    if (fs.statSync(fullFolderPath).isDirectory()) {
        ['block.json', 'local_field_group.php'].forEach(fileName => {
            let filePath = path.join(fullFolderPath, fileName);

            // Check if file exists
            if (fs.existsSync(filePath)) {
                let action;
                if (fileName === 'block.json') {
                    action = 'uploadAcfBlockJsonFile';
                } else if (fileName === 'local_field_group.php') {
                    action = 'uploadAcfBlockPhpFile';
                }

                // After successful write, upload the file.
                uploadFile({
                    filePath: filePath,
                    action: action,
                    folder: folder
                });

                console.log(`Directory '${folder}' contains: ${fileName}`);
            }
        });
    }
});
