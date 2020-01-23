import { StyleFunction } from "leaflet";
import { GeoJSON } from "react-leaflet";
import { GeoJsonObject } from "geojson";
import React from "react";

type PercentileKeys = 0.125 | 0.25 | 0.375 | 0.5 | 0.625 | 0.75 | 0.875;
type PercentileData = {
    [K in PercentileKeys]: number;
}

function getFillColor(value: number, pct: PercentileData) {
    return value > pct[0.875] ? '#0c2c84' :
        value > pct[0.75] ? '#225ea8' :
            value > pct[0.625] ? '#1d91c0' :
                value > pct[0.5] ? '#41b6c4' :
                    value > pct[0.375] ? '#7fcdbb' :
                        value > pct[0.25] ? '#c7e9b4' :
                            value > pct[0.125] ? '#edf8b1' :
                                '#ffffd9';
}

interface CountyDataProps {
    column: string;
    data: GeoJsonObject;
}

interface CountyDataState {
    percentiles?: PercentileData;
}

export default class CountyData extends React.Component<CountyDataProps, CountyDataState> {
    constructor(props: CountyDataProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch(`http://localhost:5000/percentiles/${this.props.column}`)
            .then(response => response.json())
            .then(data => this.setState({ percentiles: data }));
    }

    render() {
        const styleCounty: StyleFunction = (feature: any) => {
            return {
                fillColor: getFillColor(
                    feature.properties[this.props.column] as number,
                    this.state.percentiles || {
                        0.125: 0,
                        0.25: 0,
                        0.375: 0,
                        0.5: 0,
                        0.625: 0,
                        0.75: 0,
                        0.875: 0
                    }
                ),
                fillOpacity: 0.8,
                stroke: false
            }
        };

        return (
            <GeoJSON data={this.props.data} style={styleCounty} />
        );
    }
}