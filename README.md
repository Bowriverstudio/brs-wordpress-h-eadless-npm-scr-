# brs-wordpress-headless-npm-scripts

Experimental Package that contains node some scripts used to help generate boiler plate code used in BRS websites.

The package will likely not be of any interest to outside parties - just open to make the deployment slightly easier and if someone finds it of use all the better.

## Installation

```bash
npm i brs-wordpress-headless-npm-scripts -D --legacy-peer-deps
```

Requires File: `brs.config.js`

```js
require("dotenv-flow").config();

/**
 * BRSConfig
 */
const config = {
  endpoint: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
  typescript: {
    generate: true,
    destination: "./src/client/genesis.generated.ts",
  },
  scaffold: {
    generate: true,
    destination: "./src/components/GenesisCustomBlocks/",
    overwrite: false,
  },
  parseGenesisCustomBlocks: {
    generate: true,
    destination: "./src/components/Html2React/parseGenesisCustomBlocks.tsx",
  },
  data: {
    menu: {
      generate: true,
      destination: "./src/tests/data/menu/",
    },
    pages: {
      generate: true,
      destination: "./src/tests/data/pages/",
    },
    destination: "./src/tests/data/",
  },
};

module.exports = config;
```

## Usage

```json
    "generate-genesis": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis",
    "generate-genesis-tests": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis-tests",
    "generate-data-pages": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-data-pages",


    "generate-genesis": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis",
    "generate-genesis-components": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis-components",
    "generate-genesis-tests": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis-tests",
    "generate-genesis-tests": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis-ts",
    "generate-genesis-tests": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis-html2react",
    "generate-data-menu": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-data-menu",



```

`npm run generate-genesis`

### Runs only the components

`npm run generate-genesis-components`

### Runs only the tests - this overwrites all generated tests

`npm run generate-genesis-tests`

### Runs only the typescript

`npm run generate-genesis-ts`

### Runs only the html2react

`npm run generate-genesis-html2react`

## Development

```bash
# https://javascript.plainenglish.io/test-your-library-locally-with-npm-link-a5aa79d07270
cd HERE
npm link
cd PROJECT
npm link brs-wordpress-headless-npm-scripts

```

### TODO

- Updated Docs
- Convert Scripts in "TODO"

Update Package notes

```json
    "generate-tw": "bin/generate-tailwind-theme",
    "push-editor-styles": "npm run build:editor.css && bin/push-editor-styles",
    "push-register-block-styles": "bin/push-register-block-styles",
    "pull-theme-files": "bin/pull-theme-files",
    "push-theme-json": "bin/push-theme-json",
    "push-genesis-block": "bin/push-genesis-block",
    "push-block": "bin/push-block",
```
