# brs-wordpress-headless-npm-scripts

Experimental Package that contains node some scripts used to help generate boiler plate code used in BRS websites.

The package will likely not be of any interest to outside parties - just open to make the deployment slightly easier.

## Installation

```bash
npm i brs-wordpress-headless-npm-scripts

yarn add brs-wordpress-headless-npm-scripts@latest  -D

npm publish

npx npm-check-updates -u -t minor


```

## Tasks

- [ ] Go through each script and make the modifications to use brs.settings.js instead of  brs.config.js [Lots of paths will change but the logic should be the same]
- [ ] yarn brs generate-test-data = If there is no file data.generator.js add it
- [ ] In function acf/generateParseAcfCustomBlocks - update add endpoint so that it accepts the path.  The (this will require editing the brs-theme) ie:

It should be able to write them here:
const MmxContactUs = dynamic(() => import('components/Molecules/ACFCustomBlocks/MmxContactUs'));

Or here:

const MmxContactUs = dynamic(() => import('components/ACFCustomBlocks/MmxContactUs'));

- [x] yarn brs acf-create-block - Change to Clack, Update The Title, it goes from Page-hero to Page Hero, Use a default icon that works.
- [ ] Add yarn brs acf-delete-block
- [ ] In yarn brs - Check if there is a newer package and give a message - Like how storybook does it.
