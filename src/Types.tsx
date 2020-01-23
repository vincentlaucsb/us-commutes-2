type PercentileKeys = 0.125 | 0.25 | 0.375 | 0.5 | 0.625 | 0.75 | 0.875;
export type PercentileData = {
    [K in PercentileKeys]: number;
}

/** Names of properties for a field */
export interface CensusMapData {
    [key: string]: number | string;

    GEO_ID: string;
    NAME: string;
    LSAD: string;
    STATE_NAME: string;
}

export interface ColumnData {
    label: string;
    units: string;
}

export const Columns = new Map<string, ColumnData>([
    ['HC01_EST_VC55', {
        label: 'Mean Commute Time',
        units: 'minutes'
    }],

    ['HC01_EST_VC54', {
        label: 'Extreme Commutes (60+ Minutes)',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC03', {
        label: 'Drove to work',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC04', {
        label: 'Drove to work (alone)',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC05', {
        label: 'Drove to work (carpool)',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC10', {
        label: 'Took public transportation to work',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC11', {
        label: 'Walked to work',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC12', {
        label: 'Biked to work',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC13', {
        label: 'Took cab, rode motorcycle, etc. to work',
        units: 'percent (of workers)'
    }],

    ['HC01_EST_VC14', {
        label: 'Worked at home',
        units: 'percent (of workers)'
    }]
]);