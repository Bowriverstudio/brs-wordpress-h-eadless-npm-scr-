/**
 * File: scripts/layout.js   
 */
const fs = require('fs');
const { getBrsConfig, getWordpressRootSource, getThemeJsonPath, logSuccess } = require('brs-wordpress-headless-npm-scripts/utils');


function camelToKebab(camelCaseString) {
    return camelCaseString.replace(/([A-Z])/g, "-$1").toLowerCase();
}


function getLayoutData() {
    const layout_data = require(getWordpressRootSource() + getBrsConfig().wordpress.layout.source)
    return layout_data;
}

function getLayoutCssDestination() {
    return getWordpressRootSource() + getBrsConfig().wordpress.layout['css-destination']
}


function generateCSSFile() {

    const layout_data = getLayoutData();


    let fileContent = `
    /**
     * This file is generated and can be rebuilt from 'yarn brs layout'
     */
    `;


    // Start of :root block
    fileContent += '\n:root {\n';

    // Generate the layout CSS
    for (let key in layout_data) {
        let cssVarName = camelToKebab(key);
        fileContent += `\t--${cssVarName}: ${layout_data[key]};\n`;
    }

    // End of :root block
    fileContent += '}\n';

    const layoutCssDestination = getLayoutCssDestination();

    fs.writeFile(layoutCssDestination, fileContent, err => {
        if (err) {
            console.error('Failed to write the CSS file', err);
        } else {
            logSuccess(`Successfully generated the CSS file at ${layoutCssDestination}`);
        }
    });
}

generateCSSFile();

function updateThemeJsonLayout() {
    // Path to theme.json file
    const themeJsonPath = getThemeJsonPath();
    const layout_data = getLayoutData();

    fs.readFile(themeJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Failed to read file at ${themeJsonPath}`, err);
            return;
        }

        // Parse the JSON data
        const themeJson = JSON.parse(data);

        // Replace the layout object
        themeJson.settings.layout = {
            "contentSize": layout_data.contentSize,
            "wideSize": layout_data.wideSize
        };

        // Convert the updated JavaScript object back into a JSON string
        const updatedData = JSON.stringify(themeJson, null, '\t');

        // Write the updated data back to the theme.json file
        fs.writeFile(themeJsonPath, updatedData, 'utf8', err => {
            if (err) {
                console.error(`Failed to write file at ${themeJsonPath}`, err);
            } else {
                logSuccess(`Successfully updated the layout in the file at ${themeJsonPath}`);
            }
        });
    });
}


updateThemeJsonLayout()
