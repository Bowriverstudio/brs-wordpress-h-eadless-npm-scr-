const { spawn } = require('child_process');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../../');
require('dotenv').config({ path: `${projectRoot}/.env.local` });


const commands = ['layout.js']


// Loop over the commands array
for (let command of commands) {
    const child = spawn(
        'node',
        [path.resolve(__dirname, `theme-utils/${command}`)],
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
}
