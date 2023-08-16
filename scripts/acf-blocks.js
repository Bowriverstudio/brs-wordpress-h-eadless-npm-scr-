const { request } = require('graphql-request');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path'); // Add this
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint, toCamelCase, logError, logSuccess } = require('brs-wordpress-headless-npm-scripts/utils');

const source = getBrsConfig().acf.source;
const rootPath = getProjectRoot() + source;
const query = `
  query NewQuery {
    acfCustomBlockDetails {
        name
        has_children
        component_name
        usage_count
        wordpress_storage
      }
    }
`;




request(getGraphQLEndpoint(), query)
    .then((data) => {
        const tableData = [];

        data.acfCustomBlockDetails.forEach(block => {
            let [projectName, folderName] = block.name.split('/'); // Split the name
            console.log(`Project Name: ${projectName}, Folder Name: ${folderName}`);
            const blockPath = path.join(rootPath, toCamelCase(block.name))
            const configFilePath = path.join(blockPath, 'config.js'); // Construct path to config.js
            const blockJsonPath = path.join(blockPath, 'block.json'); // Construct path to config.js

            const configFileContent = require(configFilePath);
            console.log(`Component overwrite is : ${configFileContent.overwrite.component}`);
            console.log(`Storybook overwrite is : ${configFileContent.overwrite.storybook}`);

            const blockExists = fs.existsSync(blockJsonPath);
            tableData.push({
                'Component Name': block.component_name,
                'Project Name': projectName,

                'Slug': block.name,
                'Has Children': block.has_children,
                'Usage Count': block.usage_count,
                'WordPress Storage ': block.wordpress_storage,
                'Overwrite Component': configFileContent.overwrite.component,
                'Overwrite Storybook': configFileContent.overwrite.storybook,
            });


        });
        console.log(chalk.green('ACF Custom Block Details'));
        console.table(tableData);


    })
    .catch((err) => {
        logError(`Error occurred: ${err}`);
    });




