/**
 * File: scripts/layout.js   
 */
const fs = require('fs');
const { getBrsConfig, camelCaseToTitleCase, logSuccess, getProjectRoot } = require('brs-wordpress-headless-npm-scripts/utils');

console.log(getBrsConfig().layout)

// 

// const theme_data = require(getProjectRoot() + config.themes.source);


// function generateTSFile(config) {
//     const theme_data = require(getProjectRoot() + config.themes.source);

//     const fileContent = `
//     /**
//      * This file is generated and can be rebuilt from 'yarn brs daisyui'
//      */

//     /**
//      * Get the default DaisyUI theme
//      * @returns {string}
//      */
//     export function getDaisyUiDefaultTheme(): string {
//       return '${config.themes.default}';
//     }

//     /**
//      * Get the available DaisyUI themes
//      * @returns {string[]}
//      */
//      export function getDaisyUiThemes(): string[] {
//        return ${JSON.stringify(config.themes.themes)};
//      }

//      /**
//       * Get the details of a specific DaisyUI theme
//       * @param {string} theme
//       * @returns {object|null}
//       */
//      export function getDaisyUiThemeDetails(theme: string): object | null {
//        return ${JSON.stringify(theme_data)};
//      }
//   `;

//     fs.writeFile(config['ts-destination'], fileContent, err => {
//         if (err) {
//             console.error('Failed to write the TypeScript file', err);
//         } else {
//             logSuccess(`Successfully generated the TypeScript file at ${config['ts-destination']}`);
//         }
//     });
// }

// generateTSFile(config);

function camelToKebab(camelCaseString) {
    return camelCaseString.replace(/([A-Z])/g, "-$1").toLowerCase();
}


function generateCSSFile(config) {

    const layout_data = require(getProjectRoot() + config.layout.source);


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

    fs.writeFile(config.layout['css-destination'], fileContent, err => {
        if (err) {
            console.error('Failed to write the CSS file', err);
        } else {
            logSuccess(`Successfully generated the CSS file at ${config.layout['css-destination']}`);
        }
    });
}

generateCSSFile(getBrsConfig());




function updateThemeJsonLayout(config) {
    // Path to theme.json file
    const themeJsonPath = getProjectRoot() + config.themejson.source;
    const layout_data = require(getProjectRoot() + config.layout.source);

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


updateThemeJsonLayout(getBrsConfig());




// function generateTailwindFile(config) {
//     const tailwindPath = getProjectRoot() + config['tailwind-destination'];

//     const theme_data = require(getProjectRoot() + config.themes.source);
//     const default_theme = config.themes.default;

//     const colors = theme_data[default_theme].colors;

//     let fileContent = `// This file is generated via yarn brs daisyui\n\nexport const daisyui = {\n    colors: {\n`;

//     for (let color_key in colors) {
//         const formattedKey = color_key.includes('-') ? `'${color_key}'` : color_key;
//         fileContent += `        ${formattedKey}: "var(--${color_key})",\n`;
//     }

//     fileContent += `    }\n}`;

//     fs.writeFile(tailwindPath, fileContent, err => {
//         if (err) {
//             console.error('Failed to write the CSS file', err);
//         } else {
//             logSuccess(`Successfully generated the Tailwindg file at ${tailwindPath}`);
//         }
//     });
// }


// generateTailwindFile(config);