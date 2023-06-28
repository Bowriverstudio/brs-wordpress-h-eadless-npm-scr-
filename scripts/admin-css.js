/**
 * File: scripts/admin-css.js   
 */
const axios = require('axios');
const FormData = require('form-data');

const { exec } = require('child_process');
const fs = require('fs');
const { getBrsConfig, getRestEndpoint, getSecrectKey, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');


const config = getBrsConfig()['admin-css']

console.log("Config:", config);

function generateTailwindCSS(input, output) {
    // console.log(`Generating Tailwind CSS from ${input} to ${output}...`);
    exec(`npx tailwindcss -i ${input} -o ${output}`, (err, stdout, stderr) => {
        const endpointURL = getRestEndpoint() + 'brsUploadEditorThemeCss';
        const secretKey = getSecrectKey();

        console.log(`Preparing to send POST request to ${endpointURL} with secret key ${secretKey}`);

        const form = new FormData();
        form.append('admin', fs.createReadStream(outputPath));
        form.append('secretKey', secretKey);

        const headers = form.getHeaders();

        console.log(`Sending POST request with headers ${JSON.stringify(headers, null, 2)}`);
        axios.post(endpointURL, form, { headers })
            .then(response => {
                console.log(`Server responded with: ${JSON.stringify(response.data, null, 2)}`);
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Error request:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error:', error.message);
                }
                console.error('Error config:', error.config);
            });


    });
}

const inputPath = getProjectRoot() + config.source;
const outputPath = getProjectRoot() + config.destination;

generateTailwindCSS(inputPath, outputPath)