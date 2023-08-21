// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

/**
 * BRS Config
 */
const config = {
    project: "mmx",
    endpoint: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
    restendpoint: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/brs/v1/`,

    "admin-css": {
        source: "/src/styles/admin/admin.css",
        destination: "/src/styles/admin/admin.generated.css",
    },
    acf: {
        source: "/src/components/Molecules/ACFCustomBlocks/",
        typescript: {
            destination: "/src/client/acf.generated.ts",
        },
        parseAcfCustomBlocks: {
            destination: "/src/components/Html2React/parseAcfCustomBlocks.tsx",
        },
        options: {
            source: "/wp/acf/options/theme-options.php",
        }
    },
    menuLocations: {
        destination: "/src/client/menu.locations.generated.ts",
    },
    gutenbergBlocks: {
        source: "/src/components/Molecules/GutenbergBlocks/",
    },
    wordpress: {
        source: "/src/styles/wordpress/",
        themejson: {
            source: "theme.json",
        },
        layout: {
            source: "layout/index.js",
            "css-destination": "layout/layout.generated.css",
            "tailwind-destination": "layout/tailwind.generated.js",
        }
    },
    layout: {
        source: "/src/styles/wordpress/layout/index.js",
        "css-destination": "./styles/wordpress/layout/layout.generated.css",
        "tailwind-destination": "/styles/wordpress/layout/tailwind.generated.js",
    },
    themejson: {
        source: "/src/styles/wordpress/theme.json",
    },
    daisyui: {
        default: "mmx",
    },
    storybook: {
        destination: "/docs/brs",
    },
    cpt: {
        source: "/wp/cpt",
    },
    'test-data': {
        source: "/src/tests/data.generator.js",
        destination: "/src/tests/data.generated.ts",
    }
};

module.exports = config;
