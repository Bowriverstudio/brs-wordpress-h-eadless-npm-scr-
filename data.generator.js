// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require("@apollo/client");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getGraphQLEndpoint } = require('brs-wordpress-headless-npm-scripts/utils');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { request } = require('graphql-request');

// GraphQL Queries
const THEME_GENERAL_SETTINGS_QUERY = gql`
  query GetThemeGeneralSettings {
    themeGeneralSettings {
      themeOptions {
        address
        email
        footerCopywrite
        footerDescription
        phoneNumber
      }
      socialMedia {
        socialItems {
            icon
            targetUrl
        }
      }
    }
  }
`;

const MENU_ITEMS_BY_LOCATION_QUERY = gql`
  query FetchMenuItemsByLocation($location: MenuLocationEnum!) {
    menuItems(where: {location: $location}) {
      nodes {
        parentId
        id
        label
        uri
      }
    }
  }
`;

const generateTestData = async () => {
    const endpoint = getGraphQLEndpoint();

    // Fetch primary menu items
    const primaryMenuItemsResponse = await request(endpoint, MENU_ITEMS_BY_LOCATION_QUERY, {
        location: "PRIMARY"
    });

    // Fetch footer menu items
    const footerMenuItemsResponse = await request(endpoint, MENU_ITEMS_BY_LOCATION_QUERY, {
        location: "FOOTER"
    });


    const footerSecondaryMenuItemsResponse = await request(endpoint, MENU_ITEMS_BY_LOCATION_QUERY, {
        location: "FOOTER_SECONDARY"
    });




    // Fetch theme options
    const themeOptionsResponse = await request(endpoint, THEME_GENERAL_SETTINGS_QUERY);

    // Construct data content
    const dataContent = `
    /**
     * File generated only for testing purposes.
     * Do not modify directly.
     * Use 'yarn brs generate-test-data' to regenerate.
     */
    export const primaryMenu = ${JSON.stringify(primaryMenuItemsResponse)};
    export const footerMenu = ${JSON.stringify(footerMenuItemsResponse)};
    export const footerSecondaryMenu = ${JSON.stringify(footerSecondaryMenuItemsResponse)};
    export const themeOptions = ${JSON.stringify(themeOptionsResponse)};
    `;

    return dataContent;
};

module.exports = generateTestData;
