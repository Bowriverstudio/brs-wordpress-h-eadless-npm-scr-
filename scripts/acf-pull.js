const { request } = require('graphql-request');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path'); // Add this
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint, toCamelCase, logError, logSuccess } = require('brs-wordpress-headless-npm-scripts/utils');

const source = getBrsConfig().acf.source;
const rootPath = getProjectRoot() + source;

const scaffoldQueryTemplate = `
  query NewQuery {
    acfCustomBlockFileScaffold(slug: "{SLUG}") {
      content
      name
    }
  }
`;

// Function to fetch the file scaffold
function fetchFileScaffold(blockName, blockPath) {
    const scaffoldQuery = scaffoldQueryTemplate.replace("{SLUG}", blockName);
    return request(getGraphQLEndpoint(), scaffoldQuery)
        .then((scaffoldData) => {

            if (Array.isArray(scaffoldData.acfCustomBlockFileScaffold)) {
                scaffoldData.acfCustomBlockFileScaffold.forEach(fileData => {
                    const filePath = path.join(blockPath, fileData.name); // Construct file path
                    fs.mkdirSync(blockPath, { recursive: true });

                    fs.writeFileSync(filePath, fileData.content); // Write file content
                    logSuccess(`File ${fileData.name} has been written to ${blockPath}`);
                });
            }
        })
        .catch((err) => {
            logError(`Error occurred fetching file scaffold: ${err}`);
            logError(`Maybe do a yarn brs acf-push to creaet the slug ${blockName} in the wordpress server`);
        });
}


const query = `
  query NewQuery {
    acfCustomBlockSummary {
        name
      }  
    }
`;

request(getGraphQLEndpoint(), query)
    .then((data) => {
        data.acfCustomBlockSummary.forEach(block => {
            let [projectName, folderName] = block.name.split('/'); // Split the name
            console.log(`Project Name: ${projectName}, Folder Name: ${folderName}`);
            const blockPath = path.join(rootPath, toCamelCase(block.name))
            const configFilePath = path.join(blockPath, 'config.js'); // Construct path to config.js
            const blockJsonPath = path.join(blockPath, 'block.json'); // Construct path to config.js

            // Check if config.js exists
            const configExists = fs.existsSync(configFilePath);
            // Check if block.json exists
            const blockExists = fs.existsSync(blockJsonPath);
            // Condition to handle different scenarios
            if (configExists && !blockExists) {
                console.warning(`config.js found but block.json does not exist in ${blockPath} folder.`);
            } else if (!configExists && !blockExists) {
                logSuccess(`Writing files for ${block.name}`)
                fetchFileScaffold(block.name, blockPath);

            } else if (configExists && blockExists) {
                const configFileContent = require(configFilePath);
                if (configFileContent.overwrite) {
                    fetchFileScaffold(block.name, blockPath);
                }
                console.log(`Both files exist. The value of overwrite in config.js is: ${configFileContent.overwrite}`);
            } else {
                console.log(`block.json found but config.js does not exist in ${block.name}.`);
                console.log(`add config.js if you want this file to be overwritten.`)
            }
        });

    })
    .catch((err) => {
        logError(`Error occurred: ${err}`);
    });





// typescript
const ts_path = getProjectRoot() + getBrsConfig().acf.typescript.destination;


const ts_query = `
query NewQuery {
    acfCustomBlocksTypescript
  }
`
request(getGraphQLEndpoint(), ts_query)
    .then((data) => {
        fs.writeFile(ts_path, data.acfCustomBlocksTypescript, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        console.log("Typescript file generated")
    })
    .catch((err) => {
        logError(`Error occurred: ${err}`);
    });

const parseAcfCustomBlocks_path = getProjectRoot() + getBrsConfig().acf.parseAcfCustomBlocks.destination;

const parseAcfCustomBlocks_query = `
      query NewQuery {
        acfCustomBlocksHtml2React
      }
    `;

request(getGraphQLEndpoint(), parseAcfCustomBlocks_query)
    .then((data) => {
        fs.ensureFile(parseAcfCustomBlocks_path)
            .then(() => {
                fs.writeFile(parseAcfCustomBlocks_path, data.acfCustomBlocksHtml2React, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
                console.log("Html2React file generated")
            })
            .catch(err => {
                logError(`Error occurred ensuring the file: ${err}`);
            });
    })
    .catch((err) => {
        logError(`Error occurred: ${err}`);
    });
