
const path = require('path');
const { request } = require('graphql-request');
const fs = require('fs');
const { getProjectRoot, getBrsConfig, getGraphQLEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');
const chalk = require('chalk');

const variables = {
    secretKey: process.env.BRS_SECRET_KEY
};

const query = `
    query NewQuery($secretKey: String!) {
        brsGetMenuLocationsEnum(secretKey: $secretKey)
    }
`;
request(getGraphQLEndpoint(), query, variables)
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
    * Locations can be edited at in the admin system
    */
    import { MenuLocationEnum } from "./graphql.generated"

    ${menuLocations}`

        const absoluteDestinationPath = path.join(getProjectRoot(), getBrsConfig().menuLocations.destination);
        fs.writeFile(absoluteDestinationPath, fileContent, err => {
            if (err) {
                console.error(chalk.red(`Error writing to file: ${err}`));
            } else {
                console.log(chalk.green(`File generated at ${getBrsConfig().menuLocations.destination}`));
            }
        });
    })
    .catch((err) => {

        const path = require('path');
        const { request } = require('graphql-request');
        const fs = require('fs');
        const { getProjectRoot, getBrsConfig, getGraphQLEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');
        const chalk = require('chalk');

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
    * Locations can be edited at in the admin system
    */
    import { MenuLocationEnum } from "./graphql.generated"

    ${menuLocations}`

                const absoluteDestinationPath = path.join(getProjectRoot(), getBrsConfig().menuLocations.destination);
                fs.writeFile(absoluteDestinationPath, fileContent, err => {
                    if (err) {
                        console.error(chalk.red(`Error writing to file: ${err}`));
                    } else {
                        console.log(chalk.green(`File generated at ${getBrsConfig().menuLocations.destination}`));
                    }
                });
            })
            .catch((err) => {
                console.error(chalk.red(`Error writing to file: ${err}`));
            });

    });


