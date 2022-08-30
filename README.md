# brs-wordpress-headless-npm-scripts

Experimental Package that contains node some scripts used to help generate boiler plate code used in BRS websites.

The package will likely not be of any interest to outside parties - just open to make the deployment slightly easier and if someone finds it of use all the better.

## Installation

```bash
npm i brs-wordpress-headless-npm-scripts -D --legacy-peer-deps
```

Requires File: `genesis.config.js`

```js
require("dotenv-flow").config();

/**
 * GenesisConfig
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
};

module.exports = config;
```

## Usage

```json
    "generate-genesis": "node ./node_modules/brs-wordpress-headless-npm-scripts/.bin/brs-generate-genesis",
```

`npm run generate-genesis`

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
