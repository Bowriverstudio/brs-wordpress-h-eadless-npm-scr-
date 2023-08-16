const { getBrsConfig, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

const filePath = getProjectRoot() + getBrsConfig().acf.options.source;
const action = 'acf-options';
const fileName = 'theme-options.php';
uploadFile({ filePath, action, fileName });
