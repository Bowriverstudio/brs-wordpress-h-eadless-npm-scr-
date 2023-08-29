const fs = require('fs');
const path = require('path');
const { request } = require('graphql-request');
const chalk = require('chalk');
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');


const { source } = getBrsConfig().wordpress.gutenbergBlocks;
const absolutePath = path.join(getProjectRoot(), source);

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const directories = getDirectories(absolutePath);

let blocksWithOverwrite = [];

// Loop through each directory and check for config.js
directories.forEach(dir => {
    const configPath = path.join(absolutePath, dir, 'config.js');
    if (fs.existsSync(configPath)) {
        console.log(`config.js found in directory: ${dir}`);
        const config = require(configPath);  // Import the config file
        if (config.overwrite && config.overwrite.storybook === true) {
            blocksWithOverwrite.push(config.name);
        }
    }
});

console.log('Blocks with overwrite.storybook set to true:', blocksWithOverwrite);



const query = `
    query BlocksQuery($blockNames: [String!]!) {
        brsGutenbergBlockStories(blockNames: $blockNames
            secretKey: "${process.env.BRS_SECRET_KEY}"
            ) {
            blocks {
                blockName
                fileContent
                fileName
            }
        }
    }
`;

console.log(blocksWithOverwrite)

request(getGraphQLEndpoint(), query, { blockNames: blocksWithOverwrite })
    .then(data => {
        // console.log(JSON.stringify(data, null, 2));
        const blockStories = data.brsGutenbergBlockStories;

        if (blockStories && Array.isArray(blockStories.blocks)) {
            for (const block of blockStories.blocks) {
                const blockName = block.blockName;

                const targetDirectory = absolutePath + block.blockName;

                const filePath = path.join(targetDirectory, block.fileName || block.name);

                fs.writeFileSync(filePath, block.fileContent);
                console.log(chalk.green(`${block.fileName} file generated.`));

            }
        }


    })
    .catch(error => {
        console.error(chalk.red(`GraphQL request failed: ${error.message}`));
    });

