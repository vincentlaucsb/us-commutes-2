import { PercentileData } from "./Types";

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