import React from 'react';
import './App.css';
import { Map, TileLayer, GeoJSON, MapControl } from 'react-leaflet'
import { GeoJsonObject } from 'geojson';
import Legend from './Legend';
import CountyData from './CountyData';
import { PercentileData, CensusMapData, Columns } from './Types';
import InfoBox from './InfoBox';
import VariableChanger, { VariableSelector } from './VariableChanger';

interface AppState {
    activeCounty?: string;
    activeCountyData?: CensusMapData;

    // The name of the active column per the PostgreSQL db
    column: string;

    data?: GeoJsonObject;
    percentiles?: PercentileData;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.updateActiveCounty = this.updateActiveCounty.bind(this);
        this.updateActiveCountyData = this.updateActiveCountyData.bind(this);

        this.state = {
            column: "HC01_EST_VC55",
        };
    }

    get currentColumn() {
        let data = Columns.get(this.state.column);

        if (!data) {
            throw new Error("Invalid column");
        }

        return data;
    }

    updateActiveCounty(geoId: string) {
        this.setState({ activeCounty: geoId });
    }

    updateActiveCountyData(data: CensusMapData) {
        this.setState({ activeCountyData: data });
    }

    componentDidMount() {
        fetch('http://localhost:5000/map')
            .then(response => response.json())
            .then(data => this.setState({ data }));

        fetch(`http://localhost:5000/percentiles/${this.state.column}`)
            .then(response => response.json())
            .then(data => this.setState({ percentiles: data }));
    }

    updateColumn(colName: string) {
        this.setState({ column: colName });
        fetch(`http://localhost:5000/percentiles/${colName}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ percentiles: data });
            });
    }

    render() {
        const position: [number, number] = [37.8, -96];
        const counties = this.state.data && this.state.percentiles ? <CountyData
            activeCounty={this.state.activeCounty}
            column={this.state.column}
            data={this.state.data}
            percentiles={this.state.percentiles}
            updateActiveCounty={this.updateActiveCounty}
            updateActiveCountyData={this.updateActiveCountyData}
        /> : <></>
        const infoBox = this.state.activeCountyData ? <InfoBox
            data={this.state.activeCountyData}
            column={this.state.column}
            columnData={this.currentColumn}
        /> : <></>

        // TODO: Update percentiles
        return (
            <Map center={position} zoom={4}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {counties}
                {infoBox}

                <VariableChanger />
                <VariableSelector updateColumn={this.updateColumn.bind(this)} />
                <Legend />
            </Map>
        );
    }
}

export default App;