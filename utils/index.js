/**
 * File: utils/index.js   
 */
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const path = require('path');
const projectRoot = path.resolve(__dirname, '../../../');

require('dotenv').config({ path: `${projectRoot}/.env.local` });
const brsConfig = require(`${projectRoot}/brs.config.js`);



// Function for logging success messages in green
function logSuccess(...messages) {
    console.log('\x1b[32m%s\x1b[0m', messages.join(' ')); // Outputs green text
}

// Function for logging error messages in red
function logError(...messages) {
    console.log('\x1b[31m%s\x1b[0m[0m', messages.join(' ')); // Outputs green text
}


function getBrsConfig() {
    return brsConfig
}

function getGraphQLEndpoint() {
    return brsConfig.endpoint;
}

function getRestEndpoint() {
    return brsConfig.restendpoint;
}
function getProjectRoot() {
    return projectRoot;
}
function getSecrectKey() {
    return process.env.BRS_SECRET_KEY
}

// Utility function to convert camel case to title case
function camelCaseToTitleCase(camelCase) {
    // split on hyphen, capitalize first letter of each word, then join with space
    return camelCase.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Utility function to convert kebab-case string with slashes to CamelCase
// ie: sandbox/kitchen-sink to SandboxKitchenSink
function toCamelCase(str) {
    return str.split(/[-/]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}



function uploadFile({ filePath, action, fileName, folder }) {


    // get your values
    const endpointURL = getRestEndpoint() + 'brsUploadFile';
    const secretKey = getSecrectKey();

    // create a form with the 'theme' field as the file
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('secretKey', secretKey);
    form.append('action', action);
    if (fileName) {
        form.append('fileName', fileName);
    }

    if (folder) {
        form.append('folder', folder);
    }


    // headers for the POST request
    const headers = form.getHeaders();

    axios.post(endpointURL, form, { headers })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });

}


module.exports = {
    camelCaseToTitleCase,
    toCamelCase,
    logSuccess,
    logError,
    getBrsConfig,
    getGraphQLEndpoint,
    getRestEndpoint,
    getSecrectKey,
    getProjectRoot,
    uploadFile
};
