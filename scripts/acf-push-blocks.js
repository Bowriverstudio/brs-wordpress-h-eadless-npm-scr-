const fs = require('fs');
const path = require('path');
const { getBrsConfig, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');
const { uploadAcfBlockToWP } = require('brs-wordpress-headless-npm-scripts/utils/acf');

const source = getBrsConfig().acf.source;
const acfDirectory = path.join(getProjectRoot(), source);

// Using synchronous readdir and stat to simplify the example.
// In production code, consider using async/await with promisify.
fs.readdirSync(acfDirectory).forEach(folder => {
    uploadAcfBlockToWP(folder)
});
