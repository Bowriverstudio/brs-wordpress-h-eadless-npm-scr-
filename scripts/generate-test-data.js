const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { getBrsConfig, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

// Constructing paths for the config and destination
const { source, destination } = getBrsConfig()['test-data'];
const absoluteConfigPath = path.join(getProjectRoot(), source);
const absoluteDestinationPath = path.join(getProjectRoot(), destination);

const generateTestData = require(absoluteConfigPath);

(async () => {
    try {
        const dataContent = await generateTestData();

        fs.writeFile(absoluteDestinationPath, dataContent, err => {
            if (err) {
                console.error(chalk.red(`Error writing to file: ${err}`));
            } else {
                console.log(chalk.green(`File generated at ${destination}`));
            }
        });

    } catch (error) {
        console.error(chalk.red("Error fetching data:", error));
    }
})();
