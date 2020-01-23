import React from 'react';
import './App.css';
import { Map, TileLayer } from 'react-leaflet'
import { GeoJsonObject } from 'geojson';
import Legend from './Legend';
import CountyData from './CountyData';
import { PercentileData, CensusMapData, Columns } from './Types';
import InfoBoxContainer, { InfoBox } from './InfoBox';
import { VariableSelector } from './VariableChanger';
import ReactModal from "react-modal";

interface AppState {
    activeCounty?: string;
    activeCountyData?: CensusMapData;

    // The name of the active column per the PostgreSQL db
    column: string;

    modalOpen: boolean;

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
            modalOpen: false
        };
    }

    get currentColumn() {
        let data = Columns.get(this.state.column);

        if (!data) {
            throw new Error("Invalid column");
        }

        return data;
    }

    get modal() {
        const countyData = this.state.activeCountyData;
        if (countyData) {
            return (
                <ReactModal isOpen={this.state.modalOpen}>
                    <h2>{countyData.NAME} {countyData.LSAD}</h2>
                    <p>Test</p>
                    <button onClick={() => this.setState({ modalOpen: false })}>Close</button>
                </ReactModal>
            );
        }

        return <></>
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

    openModal() {
        this.setState({ modalOpen: true });
    }

    render() {
        const position: [number, number] = [37.8, -96];
        const counties = this.state.data && this.state.percentiles ? <CountyData
            activeCounty={this.state.activeCounty}
            column={this.state.column}
            data={this.state.data}
            percentiles={this.state.percentiles}
            openModal={this.openModal.bind(this)}
            updateActiveCounty={this.updateActiveCounty}
            updateActiveCountyData={this.updateActiveCountyData}
        /> : <></>
        
        // TODO: Update percentiles
        return (
            <>
                {this.modal}
                <Map center={position} zoom={4}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {counties}

                    <InfoBoxContainer />
                    <InfoBox 
                        data={this.state.activeCountyData}
                        column={this.state.column}
                        columnData={this.currentColumn}
                    />
                    <VariableSelector updateColumn={this.updateColumn.bind(this)} />
                    <Legend />
                </Map>
            </>
        );
    }
}

export default App;