const chalk = require('chalk');
const fs = require('fs-extra');
const { request } = require('graphql-request');
const path = require('path');
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint, toCamelCase } = require('brs-wordpress-headless-npm-scripts/utils');


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



module.exports = {
    getAcfBlockNames,
    createBlockScaffoldFiles,
    generateAcfTypescript,
    generateParseAcfCustomBlocks
}