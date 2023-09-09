const { getBrsConfig, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

const filePath = getProjectRoot() + getBrsConfig().wordpress.functions.source;
const action = 'uploadFunctionsFile';
uploadFile({ filePath, action, fileName: 'functions.php' });
