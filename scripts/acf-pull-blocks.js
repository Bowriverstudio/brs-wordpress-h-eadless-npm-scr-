const chalk = require('chalk');
const { getAcfBlockNames, generateAcfTypescript, generateParseAcfCustomBlocks, createBlockScaffoldFiles } = require('brs-wordpress-headless-npm-scripts/utils/acf');


async function createAllBlockScaffolds() {
    try {
        const blockNames = await getAcfBlockNames();
        for (const blockName of blockNames) {
            await createBlockScaffoldFiles(blockName);
        }
    } catch (err) {
        console.error(chalk.red(`Error occurred while creating block scaffolds: ${err}`));
    }
}
createAllBlockScaffolds();


// Generate files for acf.
generateAcfTypescript()
generateParseAcfCustomBlocks()