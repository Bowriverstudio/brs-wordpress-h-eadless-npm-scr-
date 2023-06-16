require("dotenv-flow").config();

/**
 * GenesisConfig
 */
const config = {
  endpoint: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
  typescript: {
    generate: true,
    destination: "./client/genesis.generated.ts",
  },
  scaffold: {
    generate: true,
    destination: "./components/GenesisCustomBlocks/",
    overwrite: false,
  },
  parseGenesisCustomBlocks: {
    generate: true,
    destination: "./components/Html2React/parseGenesisCustomBlocks.tsx",
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
