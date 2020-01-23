import React from 'react';
import './App.css';
import { Map, Marker, Popup, TileLayer, GeoJSON, MapControl } from 'react-leaflet'
import { GeoJsonObject } from 'geojson';
import Legend from './Legend';
import CountyData from './CountyData';
import { PercentileData } from './Types';

interface AppState {
    activeCounty?: string;
    column: string;
    data?: GeoJsonObject;
    percentiles?: PercentileData;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.updateActiveCounty = this.updateActiveCounty.bind(this);

        this.state = {
            column: "HC01_EST_VC55",
        };
    }

    static get columnNames() {
        return [
            'HC01_EST_VC55' // Mean Commute Time
        ];
    }

    updateActiveCounty(geoId: string) {
        this.setState({ activeCounty: geoId });
    }

    componentDidMount() {
        fetch('http://localhost:5000/map')
            .then(response => response.json())
            .then(data => this.setState({ data }));

        fetch(`http://localhost:5000/percentiles/${this.state.column}`)
            .then(response => response.json())
            .then(data => this.setState({ percentiles: data }));
    }

    render() {
        const position: [number, number] = [37.8, -96];
        const counties = this.state.data && this.state.percentiles ? <CountyData
            activeCounty={this.state.activeCounty}
            column={this.state.column}
            data={this.state.data}
            percentiles={this.state.percentiles}
            updateActiveCounty={this.updateActiveCounty}
        /> : <></>

        return (
            <Map center={position} zoom={4}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {counties}
                <Legend />
            </Map>
        );
    }
}

export default App;