/**
 * index.js 
 * 
 * entry for : "brs-wordpress-headless-npm-scripts",
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../../');
require('dotenv').config({ path: `${projectRoot}/.env.local` });

const commands = [
    {
        command: "daisyui",
        script: "daisyui.js",
        description: "Generates the daisyui.generated.css, daisyui.generated.config.tss files and updates the theme.json color schema"
    },
    {
        command: "menu-locations",
        script: "menu-locations.js",
        description: "Generates the menu-locations.ts file"
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

const userCommand = process.argv[2];

const selectedCommand = commands.find(cmd => cmd.command === userCommand);

if (selectedCommand) {
    console.log(`Running command 'yarn brs ${selectedCommand.command}', which will ${selectedCommand.description}`);

    const child = spawn(
        'node',
        [path.resolve(__dirname, `scripts/${selectedCommand.command}.js`)],
        { env: process.env }
    );

    child.stdout.on('data', (data) => {
        console.log(`stdout:\n${data}`);
    });

    child.stderr.on('data', (data) => {
        console.error(`stderr:\n${data}`);
    });

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
