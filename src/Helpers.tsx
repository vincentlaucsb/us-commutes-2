import { PercentileData } from "./Types";

/** Keys are (non-inclusive) upper bounds for percentiles */
export const FillColor = new Map<number, string>([
    [0.125, '#ffffd9'],
    [0.25, '#edf8b1'],
    [0.375, '#c7e9b4'],
    [0.5, '#7fcdbb'],
    [0.625, '#41b6c4'],
    [0.75, '#1d91c0'],
    [0.875, '#225ea8'],
    [1, '#0c2c84']
]);

export function getFillColor(value: number, pct: PercentileData) {
    return value > pct[0.875] ? '#0c2c84' :
        value > pct[0.75] ? '#225ea8' :
            value > pct[0.625] ? '#1d91c0' :
                value > pct[0.5] ? '#41b6c4' :
                    value > pct[0.375] ? '#7fcdbb' :
                        value > pct[0.25] ? '#c7e9b4' :
                            value > pct[0.125] ? '#edf8b1' :
                                '#ffffd9';
}