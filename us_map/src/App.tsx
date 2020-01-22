import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import { GeoJsonObject } from 'geojson';
import * as geojson from 'geojson';
import { StyleFunction } from 'leaflet';

interface AppState {
    data?: GeoJsonObject;
}

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

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            data: undefined
        };
    }

    static get columnNames() {
        return [
            'HC01_EST_VC55' // Mean Commute Time
        ];
    }

    componentDidMount() {
        fetch('http://localhost:5000/map')
            .then(response => response.json())
            .then(data => this.setState({ data }));
    }
    

    render() {
        const styleCounty: StyleFunction = (feature: any) => {
            return {
                fillColor: getFillColor(
                    feature.properties['HC01_EST_VC55'] as number,
                    { "0.125": 17.1, "0.25": 19.5, "0.375": 21.2, "0.5": 23, "0.625": 24.6, "0.75": 26.7, "0.875": 29.8375 }
                ),
                fillOpacity: 0.8,
                stroke: false
            }
        };

        const position: [number, number] = [37.8, -96];
        const counties = this.state.data ? <GeoJSON
            data={this.state.data}
            style={styleCounty}
        /> : <></>

        return (
            <Map center={position} zoom={4}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {counties}
            </Map>
        );
    }
}

export default App;
