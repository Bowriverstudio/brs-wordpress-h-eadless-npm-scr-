/**
 * index.js 
 * 
 * entry for : "brs-wordpress-headless-npm-scripts",
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { intro, outro, select } = require('@clack/prompts');
const projectRoot = path.resolve(__dirname, '../../');
require('dotenv').config({ path: `${projectRoot}/.env.local` });

const commands = [
    {
        command: "acf-blocks",
        script: "acf-blocks.js",
        description: "Summerizes ACF blocks"
    },
    {
        command: "acf-create-block",
        script: "acf-create-block.js",
        description: "Creates a new ACF block"
    },
    {
        command: "acf-pull-block",
        script: "acf-pull-block.js",
        description: "Pulls a specified ACF block data from WordPress"
    },

    {
        command: "acf-pull-blocks",
        script: "acf-pull-blocks.js",
        description: "Pulls all ACF block data from WordPress"
    },
    {
        command: "acf-push-options",
        script: "acf-push-options.js",
        description: "Push ACF Options to WordPress"
    },
    {
        command: "daisyui",
        script: "daisyui.js",
        description: "DO NOT USE: Generates the daisyui.generated.css, daisyui.generated.config.tss, tailwind.generated.ts files and updates the theme.json color schema"
    },
    {
        command: "layout",
        script: "layout.js",
        description: "Generates the layout.generated.css, and updates the theme.json layout schema"
    },
    {
        command: "menu-locations",
        script: "menu-locations.js",
        description: "Generates the menu-locations.ts file"
    },
    {
        command: "register_block_styles",
        script: "register_block_styles.js",
        description: "Pushes the each gutenbergs register_block_styles and css files to WordPress"
    },
    {
        command: "push-admin-styles",
        script: "push-admin-styles.js",
        description: "Compiles with tailwind the admin styles and pushes it to gutenberg"
    },
    {
        command: "push-theme",
        script: "push-theme.js",
        description: "Pushes the theme.json to the WordPress site"
    },
    {
        command: "validate",
        script: "validate.js",
        description: "Validates the brs.config.js file"
    }
];

async function main() {
    const userCommand = process.argv[2];

    if (userCommand) {
        const isValidCommand = commands.some(cmd => cmd.command === userCommand);

        if (isValidCommand) {
            runCommand(userCommand);
        } else {
            console.log(`'yarn brs ${userCommand}' is not a valid command. Please use one of the following:`);
            displayAvailableCommands();
            process.exit(1); // Exit with an error code.
        }
    } else {
        promptForCommand();
    }
}

function displayAvailableCommands() {
    const displayTable = commands.map(({ command, description }) => ({
        command: `yarn brs ${command}`,
        description
    }));
    console.table(displayTable);
}

async function promptForCommand() {
    intro(`Command Selector`);

    const commandOptions = commands.map(({ command, description }) => ({
        value: command,
        label: `${command} - ${description}`
    }));

    try {
        const selectedCommand = await select({
            message: 'Which command do you want to execute?',
            options: commandOptions
        });

        runCommand(selectedCommand);
    } catch (value) {
        outro(`Thanks for using the Command Selector!`);
        process.exit(0);
    }
}


function runCommand(userCommand) {
    const argsToForward = process.argv.slice(3);
    const selectedCommand = commands.find(cmd => cmd.command === userCommand);

    if (selectedCommand) {
        console.log(`Running command 'yarn brs ${selectedCommand.command}', which will ${selectedCommand.description}`);

        const child = spawn(
            'node',
            [path.resolve(__dirname, `scripts/${selectedCommand.script}`), ...argsToForward],
            { stdio: 'inherit', env: process.env } // Forward stdio to the child process
        );

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

    } else {
        console.log(`'yarn brs ${userCommand}' is not a valid command. Please use one of the following:`);
        const displayTable = commands.map(({ command, description }) => ({
            command: `yarn brs ${command}`,
            description
        }));
        console.table(displayTable);
    }
}



main();
