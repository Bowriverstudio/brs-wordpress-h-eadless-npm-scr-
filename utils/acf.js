const chalk = require('chalk');
const fs = require('fs-extra');
const { request } = require('graphql-request');
const path = require('path');
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint, toCamelCase, uploadFile } = require('brs-wordpress-headless-npm-scripts/utils');


function generateAcfTypescript() {
    const ts_path = getProjectRoot() + getBrsConfig().acf.typescript.destination;
    const ts_query = `
    query NewQuery {
        acfCustomBlocksTypescript
    }
    `;

    request(getGraphQLEndpoint(), ts_query)
        .then((data) => {
            fs.writeFile(ts_path, data.acfCustomBlocksTypescript, (err) => {
                if (err) throw err;
                console.log(chalk.green(`Typescript file generated`));
            });
        })
        .catch((err) => {
            console.error(chalk.red(`Error occurred: ${err}`));
        });
}


function generateParseAcfCustomBlocks() {
    const parseAcfCustomBlocks_path = getProjectRoot() + getBrsConfig().acf.parseAcfCustomBlocks.destination;
    const acfComponentsRootPath = getBrsConfig().acf.componentsRootPath || "components/Molecules/ACFCustomBlocks/";

    const parseAcfCustomBlocks_query = `
    query NewQuery {
        acfCustomBlocksHtml2React(acfComponentsRootPath: "${acfComponentsRootPath}")
    }
    `;


    request(getGraphQLEndpoint(), parseAcfCustomBlocks_query)
        .then((data) => {
            fs.ensureFile(parseAcfCustomBlocks_path)
                .then(() => {
                    fs.writeFile(parseAcfCustomBlocks_path, data.acfCustomBlocksHtml2React, (err) => {
                        if (err) throw err;
                        console.log(chalk.green(`Html2React file generated`));
                    });
                })
                .catch(err => {
                    console.error(chalk.red(`Error occurred: ${err}`));
                });
        })
        .catch((err) => {
            console.error(chalk.red(`Error occurred: ${err}`));
        });
}

function shouldProcessAcfConfigBlock(configFileContent) {
    const { component, storybook } = configFileContent.overwrite;

    if (!component && !storybook) {
        return false;
    }

    return {
        processComponent: component,
        processStorybook: storybook
    };
}


async function fetchBlockScaffold(blockName, type = null) {
    let blockScaffoldQueryTemplate;

    if (type === "storybook") {
        blockScaffoldQueryTemplate = `
            query {
                acfCustomBlockFileScaffold(slug: "{SLUG}", type: "storybook") {
                    content
                    name
                    type
                }
            }
        `;
    } else {
        blockScaffoldQueryTemplate = `
            query {
                acfCustomBlockFileScaffold(slug: "{SLUG}") {
                    content
                    name
                }
            }
        `;
    }

    const queryForScaffold = blockScaffoldQueryTemplate.replace("{SLUG}", blockName);

    return await request(getGraphQLEndpoint(), queryForScaffold);
}



// Function to fetch and create scaffold files for the given block
async function createBlockScaffoldFiles(blockName) {
    const source = getBrsConfig().acf.source;
    const rootPath = getProjectRoot() + source;
    const targetDirectory = path.join(rootPath, toCamelCase(blockName))
    const configFilePath = path.join(targetDirectory, 'config.js');

    if (!fs.existsSync(configFilePath)) {
        return false;
    }

    const configFileContent = require(configFilePath);
    const processConfig = shouldProcessAcfConfigBlock(configFileContent);

    if (!processConfig) {
        console.log(chalk.yellow(`Component and storybook overwrite both set to false for ${blockName}. Skipping...`));
        return false;
    }

    const scaffoldResponse = await fetchBlockScaffold(blockName, processConfig.processComponent ? null : "storybook");

    if (Array.isArray(scaffoldResponse.acfCustomBlockFileScaffold)) {
        for (const fileDetail of scaffoldResponse.acfCustomBlockFileScaffold) {
            const filePath = path.join(targetDirectory, fileDetail.fileName || fileDetail.name);
            fs.mkdirSync(targetDirectory, { recursive: true });
            fs.writeFileSync(filePath, fileDetail.content);
            console.log(chalk.green(`${fileDetail.fileName || fileDetail.name} file generated.`));
        }
    }
}


async function getAcfBlockNames() {
    const query = `
        query NewQuery {
            acfCustomBlockSummary {
                name
            }
        }
    `;

    try {
        const data = await request(getGraphQLEndpoint(), query);
        return data.acfCustomBlockSummary.map(block => block.name);
    } catch (error) {
        console.error(chalk.red(`Error fetching block names: ${error}`));
        return [];
    }
}

const uploadAcfBlockToWP = (folder) => {

    const source = getBrsConfig().acf.source;
    const acfDirectory = path.join(getProjectRoot(), source);
    const fullFolderPath = path.join(acfDirectory, folder);
    ['block.json', 'local_field_group.php'].forEach(fileName => {
        let filePath = path.join(fullFolderPath, fileName);

        // Check if file exists
        if (fs.existsSync(filePath)) {
            let action;
            if (fileName === 'block.json') {
                action = 'uploadAcfBlockJsonFile';
            } else if (fileName === 'local_field_group.php') {
                action = 'uploadAcfBlockPhpFile';
            }

            // After successful write, upload the file.
            uploadFile({
                filePath: filePath,
                action: action,
                folder: folder
            });

            console.log(`Directory '${folder}' contains: ${fileName}`);
        }
    });
}




module.exports = {
    getAcfBlockNames,
    createBlockScaffoldFiles,
    generateAcfTypescript,
    generateParseAcfCustomBlocks,
    uploadAcfBlockToWP
}