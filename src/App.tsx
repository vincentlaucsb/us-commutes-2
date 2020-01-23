import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, Marker, Popup, TileLayer, GeoJSON, MapControl } from 'react-leaflet'
import { GeoJsonObject } from 'geojson';
import * as geojson from 'geojson';
import { StyleFunction } from 'leaflet';
import Legend from './Legend';
import CountyData from './CountyData';

interface AppState {
    data?: GeoJsonObject;
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
        const position: [number, number] = [37.8, -96];
        const counties = this.state.data ? <CountyData
            data={this.state.data}
            column="HC01_EST_VC55"
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