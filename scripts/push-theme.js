const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

console.log("push-theme.js")

const { getBrsConfig, getSecrectKey, getProjectRoot, getRestEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');


console.log(getRestEndpoint())
const themePath = getProjectRoot() + getBrsConfig().themejson.source;
console.log(getSecrectKey())

console.log(themePath)


// get your values
const endpointURL = getRestEndpoint() + 'brsUploadThemeJson';
const secretKey = getSecrectKey();
const pathToFile = getProjectRoot() + getBrsConfig().themejson.source;

// create a form with the 'theme' field as the file
const form = new FormData();
form.append('theme', fs.createReadStream(pathToFile));
form.append('secretKey', secretKey);

// headers for the POST request
const headers = form.getHeaders();

axios.post(endpointURL, form, { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
