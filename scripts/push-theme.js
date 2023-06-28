const { getBrsConfig, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

const filePath = getProjectRoot() + getBrsConfig().themejson.source;
const action = 'theme_json';
uploadFile({ filePath, action });
