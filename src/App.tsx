import React from 'react';
import './App.css';
import { Map, TileLayer } from 'react-leaflet'
import { GeoJsonObject } from 'geojson';
import MapLegendContainer, { MapLegend } from './Legend';
import CountyData from './CountyData';
import { PercentileData, CensusMapData, Columns } from './Types';
import InfoBoxContainer, { InfoBox } from './InfoBox';
import { VariableSelector } from './VariableChanger';
import CountyModal from './CountyModal';
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

        if (countyData && this.state.data) {
            return (
                <CountyModal
                    isOpen={this.state.modalOpen}
                    close={() => this.setState({ modalOpen: false })}
                    data={countyData}
                    numCounties={this.state.data['features'].length}
                />
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
        fetch('http://vincela.com:8000/map')
            .then(response => response.json())
            .then(data => this.setState({ data }));

        fetch(`http://vincela.com:8000/percentiles/${this.state.column}`)
            .then(response => response.json())
            .then(data => this.setState({ percentiles: data }));
    }

    updateColumn(colName: string) {
        this.setState({ column: colName });
        fetch(`http://vincela.com:8000/percentiles/${colName}`)
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

        ReactModal.setAppElement(document.getElementById("root"));
        
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
                    <MapLegendContainer />

                    <InfoBox 
                        data={this.state.activeCountyData}
                        column={this.state.column}
                        columnData={this.currentColumn}
                    />
                    <VariableSelector updateColumn={this.updateColumn.bind(this)} />
                    <MapLegend
                        data={this.state.activeCountyData}
                        column={this.state.column}
                        percentiles={this.state.percentiles}
                    />
                </Map>
            </>
        );
    }
}

export default App;