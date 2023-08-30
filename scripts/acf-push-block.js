const chalk = require('chalk');
const fs = require('fs-extra');
const { request } = require('graphql-request');
const path = require('path'); // Add this
const { getBrsConfig, getProjectRoot, getGraphQLEndpoint, toCamelCase, logError, logSuccess } = require('brs-wordpress-headless-npm-scripts/utils');
const { generateAcfTypescript, generateParseAcfCustomBlocks, uploadAcfBlockToWP } = require('brs-wordpress-headless-npm-scripts/utils/acf');

const source = getBrsConfig().acf.source;
const rootPath = getProjectRoot() + source;


const { intro, outro, isCancel, cancel, select } = require('@clack/prompts');

const args = process.argv.slice(2);
const selectedComponentSlug = args[0];

const query = `
  query NewQuery {
    acfCustomBlockDetails {
        name
        component_name
      }
    }
`;
async function promptForComponent() {
    intro(`Component Selector`);

    const data = await request(getGraphQLEndpoint(), query);
    const componentOptions = data.acfCustomBlockDetails.map(block => ({
        value: block.name,
        label: `${block.component_name} / ${block.name}`
    }));

    const selectedComponentSlug = await select({
        message: 'Which component do you want to select?',
        options: componentOptions
    });

    handleSelectedComponentSlug(selectedComponentSlug);


}

async function handleSelectedComponentSlug(selectedComponentSlug) {
    const data = await request(getGraphQLEndpoint(), query);
    const selectedComponent = data.acfCustomBlockDetails.find(block => block.name === selectedComponentSlug);
    if (selectedComponent) {
        // console.log("selectedComponent.name", selectedComponent)
        uploadAcfBlockToWP(selectedComponent.component_name)
    } else {
        console.log(`Component with slug "${selectedComponentSlug}" not found.`);
    }
}


// Entry Point
if (selectedComponentSlug && selectedComponentSlug.trim() !== "") {
    handleSelectedComponentSlug(selectedComponentSlug);
} else {
    promptForComponent();
}


generateAcfTypescript();
generateParseAcfCustomBlocks()