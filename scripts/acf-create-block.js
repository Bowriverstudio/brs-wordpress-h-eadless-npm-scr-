const chalk = require('chalk');
const fs = require('fs');
const path = require('path'); // Add this
const { getBrsConfig, getProjectRoot, uploadFile, toCamelCase } = require('brs-wordpress-headless-npm-scripts/utils');
const { text, intro, isCancel, cancel, outro } = require('@clack/prompts');

const source = getBrsConfig().acf.source;
const project = getBrsConfig().project;
const rootPath = getProjectRoot() + source;

// Utility function to capitalize a string
function capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const askQuestion = async (query, defaultAnswer = '', required = false) => {
    const user_input = await text({
        message: query,
        initialValue: defaultAnswer,
        validate(value) {
            if (required && value.length === 0) return 'Value is required!';
        },
    });
    if (isCancel(user_input)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }
    return user_input;
};

const main = async () => {

    intro('Create ACF Block');

    const block_name = await askQuestion('`Enter block name alone (use a "-" to separate words), or a full path in the format project/block:`', `${project}/`, true);

    // Check if user input contains '/'
    const full_block_name = `${block_name.includes('/') ? '' : project + '/'}${block_name.toLowerCase()}`;
    const simple_block_name = full_block_name.split('/')[1]

    // Folder will be the second part of the name (after '/'). This will be used in uploadFile.
    const folder_name = toCamelCase(simple_block_name)

    // Title will default to capitalized version of user input (without the project prefix).
    const block_title = await askQuestion('Enter block title', capitalize(simple_block_name.replace(/-/gi, ' ')), true);

    // Other inputs with their default values.
    const block_description = await askQuestion('Enter block description');
    const block_category = await askQuestion('Enter block category', 'formatting');
    let block_icon = await askQuestion('Enter block icon', 'schedule');
    let keywords_input = await askQuestion('Enter keywords (comma separated)');

    // Process keywords input to get an array of keywords.
    const keywords = keywords_input ? keywords_input.split(',').map(keyword => keyword.trim()) : [];

    // Construct data for the block.json file.
    const data = {
        name: block_name,
        title: block_title.split(' ').map(word => capitalize(word)).join(' '),
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
    const dirPath = path.join(rootPath, folder_name);
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
        const configData = `
        module.exports = {
            overwrite: {
                // yarn brs acf-pull-block or blocks will overwrite this component or storybook based on these values
                storybook: true,
                component: false
            }
        };
        `;

        // Write the config.js file.
        fs.writeFile(configJsPath, configData, (err) => {
            if (err) throw err;
            outro('Operation completed. The config.js file has been saved in ' + configJsPath);
        });

    }
};

main();
