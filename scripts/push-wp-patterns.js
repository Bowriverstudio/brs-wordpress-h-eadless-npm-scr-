const fs = require('fs');
const path = require('path');

const { getBrsConfig, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

const filePath = getProjectRoot() + getBrsConfig().wordpress.patterns.source;
const action = 'patterns';

fs.readdir(filePath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const fullFilePath = path.join(filePath, file);
        if (fs.statSync(fullFilePath).isFile() && path.extname(file) === '.php') {
            uploadFile({ filePath: fullFilePath, action, fileName: file });

        }
    });
});


