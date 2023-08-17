/**
 * File: scripts/admin-css.js   
 */
const axios = require('axios');
const FormData = require('form-data');

const { exec } = require('child_process');
const fs = require('fs');
const { getBrsConfig, uploadFile, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

//uploadAdminStyles

const config = getBrsConfig()['admin-css']

console.log("Config:", config);

function generateTailwindCSS(input, output) {
    // console.log(`Generating Tailwind CSS from ${input} to ${output}...`);
    exec(`npx tailwindcss -i ${input} -o ${output}`, (err, stdout, stderr) => {
        const action = 'uploadAdminStyles';
        uploadFile({ filePath: outputPath, action, fileName: 'admin.css' });
    });
}



const inputPath = getProjectRoot() + config.source;
const outputPath = getProjectRoot() + config.destination;

generateTailwindCSS(inputPath, outputPath)