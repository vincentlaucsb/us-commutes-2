﻿type PercentileKeys = 0.125 | 0.25 | 0.375 | 0.5 | 0.625 | 0.75 | 0.875;
export type PercentileData = {
    [K in PercentileKeys]: number;
}