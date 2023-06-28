/**
 * File: scripts/daisyui.js   
 */
const fs = require('fs');
const { getBrsConfig, camelCaseToTitleCase, logSuccess, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

// console.log(getBrsConfig().daisyui)

const config = getBrsConfig().daisyui;

const theme_data = require(getProjectRoot() + config.themes.source);


function generateTSFile(config) {
    const theme_data = require(getProjectRoot() + config.themes.source);

    const fileContent = `
    /**
     * This file is generated and can be rebuilt from 'yarn brs daisyui'
     */
  
    /**
     * Get the default DaisyUI theme
     * @returns {string}
     */
    export function getDaisyUiDefaultTheme(): string {
      return '${config.themes.default}';
    }

    /**
     * Get the available DaisyUI themes
     * @returns {string[]}
     */
     export function getDaisyUiThemes(): string[] {
       return ${JSON.stringify(config.themes.themes)};
     }

     /**
      * Get the details of a specific DaisyUI theme
      * @param {string} theme
      * @returns {object|null}
      */
     export function getDaisyUiThemeDetails(theme: string): object | null {
       return ${JSON.stringify(theme_data)};
     }
  `;

    fs.writeFile(config['ts-destination'], fileContent, err => {
        if (err) {
            console.error('Failed to write the TypeScript file', err);
        } else {
            logSuccess(`Successfully generated the TypeScript file at ${config['ts-destination']}`);
        }
    });
}

generateTSFile(config);


function generateCSSFile(config) {
    const theme_data = require(getProjectRoot() + config.themes.source);

    let fileContent = `
    /**
     * This file is generated and can be rebuilt from 'yarn brs daisyui'
     */
    `;

    let colorKeysSet = new Set();

    for (let theme_name in theme_data) {
        const colors = theme_data[theme_name].colors;
        fileContent += `
        [data-theme="${theme_name}"] {`;

        for (let color_key in colors) {
            fileContent += `
            --${color_key}: ${colors[color_key]};`;

            colorKeysSet.add(color_key);
        }

        fileContent += `
        }\n`;
    }

    // Generate the color classes just once, after all themes are done
    for (let color_key of colorKeysSet) {
        fileContent += `
        .has-${color_key}-color {
            color: var(--${color_key});
        }
        .has-${color_key}-background-color {
            background-color: var(--${color_key});
        }`;
    }

    fs.writeFile(config['css-destination'], fileContent, err => {
        if (err) {
            console.error('Failed to write the CSS file', err);
        } else {
            logSuccess(`Successfully generated the CSS file at ${config['css-destination']}`);
        }
    });
}

generateCSSFile(config);



function updateThemeJsonPalette(config) {
    // Path to theme.json file
    const themeJsonPath = getProjectRoot() + config.themejson.source;

    const theme_data = require(getProjectRoot() + config.daisyui.themes.source);
    const default_theme = config.daisyui.themes.default;

    const colors = theme_data[default_theme].colors;

    // Read the theme.json file
    fs.readFile(themeJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Failed to read file at ${themeJsonPath}`, err);
            return;
        }

        // Parse the file data into a JavaScript object
        const themeJson = JSON.parse(data);

        // New color data
        const newColorPalette = [];

        // Iterate over colors and create the palette
        for (let colorName in colors) {
            const colorValue = colors[colorName];
            newColorPalette.push({
                "color": colorValue,
                "name": camelCaseToTitleCase(colorName),
                "slug": colorName
            });
        }

        // Replace the palette array in settings.color with the new color data
        themeJson.settings.color.palette = newColorPalette;

        // Convert the updated JavaScript object back into a JSON string
        const updatedData = JSON.stringify(themeJson, null, '\t');

        // Write the updated data back to the theme.json file
        fs.writeFile(themeJsonPath, updatedData, 'utf8', err => {
            if (err) {
                console.error(`Failed to write file at ${themeJsonPath}`, err);
            } else {
                logSuccess(`Successfully updated the palette in the file at ${themeJsonPath}`);
            }
        });
    });
}

updateThemeJsonPalette(getBrsConfig());




function generateTailwindFile(config) {
    const tailwindPath = getProjectRoot() + config['tailwind-destination'];

    const theme_data = require(getProjectRoot() + config.themes.source);
    const default_theme = config.themes.default;

    const colors = theme_data[default_theme].colors;

    let fileContent = `// This file is generated via yarn brs daisyui\n\nexport const daisyui = {\n    colors: {\n`;

    for (let color_key in colors) {
        const formattedKey = color_key.includes('-') ? `'${color_key}'` : color_key;
        fileContent += `        ${formattedKey}: "var(--${color_key})",\n`;
    }

    fileContent += `    }\n}`;

    fs.writeFile(tailwindPath, fileContent, err => {
        if (err) {
            console.error('Failed to write the CSS file', err);
        } else {
            logSuccess(`Successfully generated the Tailwindg file at ${tailwindPath}`);
        }
    });
}


generateTailwindFile(config);