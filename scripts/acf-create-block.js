const readline = require('readline');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path'); // Add this
const { getBrsConfig, getProjectRoot, uploadFile, toCamelCase } = require('brs-wordpress-headless-npm-scripts/utils');

const source = getBrsConfig().acf.source;
const project = getBrsConfig().project;
const rootPath = getProjectRoot() + source;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility function to capitalize a string
function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const askQuestion = (query, defaultAnswer = '') => {
    return new Promise((resolve) => {
        const question = defaultAnswer
            ? `${query}: ${chalk.gray('(Default: ' + defaultAnswer + ')')} `
            : `${query}: `;

        rl.question(question, (answer) => {
            resolve(answer || defaultAnswer);
        });
    });
};
const main = async () => {
    // Name input. Name format will be: project/user_input
    const user_input = await askQuestion(`Enter block name (use a "-" to seperate words)`, `${project}/`);
    const block_name = project + '/' + user_input.toLowerCase();  // Format name

    // Folder will be the second part of the name (after '/'). This will be used in uploadFile.
    const folder_name = toCamelCase(block_name)

    // Title will default to capitalized version of user input (without the project prefix).
    const block_title = await askQuestion('Enter block title', capitalize(user_input));

    // Other inputs with their default values.
    let block_description = await askQuestion('Enter block description');
    let block_category = await askQuestion('Enter block category', 'formatting');
    let block_icon = await askQuestion('Enter block icon', 'dashicons-art');
    let keywords_input = await askQuestion('Enter keywords (comma separated)');

    rl.close();

    // Process keywords input to get an array of keywords.
    const keywords = keywords_input.split(',').map(keyword => keyword.trim());

    // Construct data for the block.json file.
    const data = {
        name: block_name,
        title: block_title,
        description: block_description,
        category: block_category,
        icon: block_icon,
        keywords,
        acf: {
            mode: "preview",
            renderCallback: "BRS\\Headless\\acf_block_render_callback"
        },
        align: "full"
    };

    // Prepare directory and file path.
    const dirPath = path.join(rootPath, toCamelCase(block_name));
    const blockJsonPath = path.join(dirPath, 'block.json');

    // Check if directory already exists to prevent overwriting.
    if (fs.existsSync(dirPath)) {
        console.log(chalk.yellow('Warning: directory ' + dirPath + ' already exists. Operation aborted to prevent overwriting.'));
    } else {
        // If directory doesn't exist, create it and write the file.
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFile(blockJsonPath, JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
            console.log('The block.json file has been saved in ' + blockJsonPath);

            // After successful write, upload the file.
            uploadFile({
                filePath: blockJsonPath,
                action: 'uploadAcfBlockJsonFile',
                folder: folder_name
                // If fileName is needed, add here.
            });
        });

        // Prepare config.js file path.
        const configJsPath = path.join(dirPath, 'config.js');

        // Construct data for the config.js file.
        const configData = "module.exports = {\n    // Overwrite this component with yarn brs acf-pull \n    overwrite:true,\n}";

        // Write the config.js file.
        fs.writeFile(configJsPath, configData, (err) => {
            if (err) throw err;
            console.log('The config.js file has been saved in ' + configJsPath);
        });

    }
};

main();
