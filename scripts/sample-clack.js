const chalk = require('chalk');
const fs = require('fs-extra');
const { request } = require('graphql-request');
const path = require('path'); // Add this
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint, toCamelCase, logError, logSuccess } = require('brs-wordpress-headless-npm-scripts/utils');

const source = getBrsConfig().acf.source;
const rootPath = getProjectRoot() + source;


const { intro, outro, isCancel, cancel, select } = require('@clack/prompts');

const components = [
    { name: 'Header', slug: 'header' },
    { name: 'Footer', slug: 'footer' },
    // ... more components
];

function isValidComponentSlug(slug) {
    // Your logic to check if the provided slug is valid
    // For example:
    const validSlugs = ['my-block', 'another-block', 'some-block']; // Replace with your valid slugs
    return validSlugs.includes(slug);
}



async function main() {
    const args = process.argv.slice(2); // Slice to remove node and script paths
    const selectedComponentSlug = args[0];

    if (selectedComponentSlug && selectedComponentSlug.trim() !== "" && isValidComponentSlug(selectedComponentSlug)) {
        handleSelectedComponentSlug(selectedComponentSlug);
    } else if (selectedComponentSlug && selectedComponentSlug.trim() !== "" && !isValidComponentSlug(selectedComponentSlug)) {
        console.log(chalk.yellow(`Warning: The provided slug "${selectedComponentSlug}" is not valid.`));
        promptForComponent();
    } else {
        promptForComponent();
    }
}

async function promptForComponent() {
    intro(`Component Selector`);

    const componentOptions = components.map(component => ({
        value: component.slug,
        label: `${component.name} / ${component.slug}`
    }));

    try {
        const selectedComponentSlug = await select({
            message: 'Which component do you want to select?',
            options: componentOptions
        });
        handleSelectedComponentSlug(selectedComponentSlug);

    } catch (value) {
        if (isCancel(value)) {
            cancel('Operation cancelled.');
            process.exit(0);
        }
    }

    outro(`Thanks for using the Component Selector!`);
}

function handleSelectedComponentSlug(selectedComponentSlug) {
    const selectedComponent = components.find(comp => comp.slug === selectedComponentSlug);
    if (selectedComponent) {
        console.log(`You selected: ${selectedComponent.name} with slug: ${selectedComponentSlug}`);
    } else {
        console.log(`Component with slug "${selectedComponentSlug}" not found.`);
    }
}

main();
