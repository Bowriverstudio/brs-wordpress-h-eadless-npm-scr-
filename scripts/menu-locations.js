/**
 * File: scripts/menu-locations.js   
 */ 
const { request } = require('graphql-request');
const fs = require('fs');
const { getBrsConfig, logError, getGraphQLEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');

const query = `
  query NewQuery {
    brsGetMenuLocationsEnum(secretKey: "${process.env.BRS_SECRET_KEY}")
  }
`;

request(getGraphQLEndpoint(), query)
  .then((data) => {
    const date = new Date();
    const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
    const menuLocations = data.brsGetMenuLocationsEnum
    .map((location, index) => `export const MENU_LOCATION_${location} = "${location}" as MenuLocationEnum`)
    .join('\n');

    const fileContent = `/** 
    * File Generated  
    * \`\`\`bash
    * yarn brs menu-locations
    * \`\`\`     
    * Date ${formattedDate}
    * File Locations can be edited at helo.com 
    */
    import {MenuLocationEnum} from "./graphql.generated"

    ${menuLocations}`

    fs.writeFile(getBrsConfig().menuLocations.destination, fileContent, err => {
      if (err) {
        logError(`Error occurred while writing to file: ${err}`);
      } else {
        console.log(`File successfully written to ${getBrsConfig().menuLocations.destination}`);
      }
    });
  })
  .catch((err) => {
    logError(`Error occurred: ${err}`);
  });


