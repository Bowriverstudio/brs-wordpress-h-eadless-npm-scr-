import React from 'react';
import config from '../../brs.config.js';
interface BRSConfig {
    project: string;
    endpoint: string;
    restendpoint: string;
    "admin-css": {
        source: string;
        destination: string;
    };
    acf: {
        source: string;
        typescript: {
            destination: string;
        };
        parseAcfCustomBlocks: {
            destination: string;
        };
        options: {
            source: string;
        };
    };
    menuLocations: {
        destination: string;
    };
    gutenbergBlocks: {
        source: string;
    };
    wordpress: {
        source: string;
        themejson: {
            source: string;
        };
        layout: {
            source: string;
            "css-destination": string;
            "tailwind-destination": string;
        };
    };
    layout: {
        source: string;
        "css-destination": string;
        "tailwind-destination": string;
    };
    themejson: {
        source: string;
    };
    daisyui: {
        default: string;
    };
    storybook: {
        destination: string;
    };
}
interface ShowBRSConfigProps {
    brsKey?: keyof BRSConfig;
    label?: string;
}

const getNestedValue = (obj: any, key: string): any => {
    const keys = key.split('.');
    let value = obj;
    for (const k of keys) {
        value = value[k];
        if (value === undefined) break;
    }
    return value;
};



const ShowBRSConfig: React.FC<ShowBRSConfigProps> = ({ brsKey, label }) => {
    const content = brsKey ? getNestedValue(config, brsKey) : config;

    return (
        <div>
            {typeof content === 'string' ? content + (label ? ' ' + label : '') : <pre>{JSON.stringify(content, null, 2)} {label}</pre>}
        </div>
    );
};

export default ShowBRSConfig;
