/**
 * File: scripts/validate.js   
 */ 
const { logSuccess, logError, getGraphQLEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');
const { request } = require('graphql-request');

const query = `
  query NewQuery {
    brsValidateSecretKey(secretKey: "${process.env.BRS_SECRET_KEY}")
  }
`;


request(getGraphQLEndpoint(), query)
  .then((data) => {
    if (data.brsValidateSecretKey) {
      logSuccess('Success: Secret key is valid');
    } else {
      logError('Error: Secret key is not valid');
    }
  })
  .catch((err) => {
    logError(`Error occurred: ${err}`);
  });

logSuccess('GraphQLEndpoint: ', getGraphQLEndpoint());
logSuccess('NEXT_PUBLIC_WORDPRESS_URL: ', process.env.NEXT_PUBLIC_WORDPRESS_URL);
logSuccess('BRS_SECRET_KEY: ', process.env.BRS_SECRET_KEY);
