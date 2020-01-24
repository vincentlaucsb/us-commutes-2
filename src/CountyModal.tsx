import { BarChart, ResponsiveContainer, ReferenceArea, CartesianGrid, Label, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CensusMapData } from "./Types";
import ReactModal from "react-modal";
import React from 'react';
import Tabs from './Tabs';

interface CountyModalProps {
    close: () => void;

    isOpen: boolean;
    data: CensusMapData;
    numCounties: number;
}

function GraphInfo(props: {
    children?: React.ReactNode;
    title: string;
    subtitle?: string;
}) {
    const subtitle = props.subtitle ? <h5>{props.subtitle}</h5> : <></>

    return (
        <div className="graph-info-row">
            <hgroup className="graph-info-label">
                <h4>{props.title}</h4>
                {subtitle}
            </hgroup>
            {props.children}
        </div>
    );
}

function GraphInfoData(props: {
    value: string | number;
    units?: string;
}) {
    const units = props.units ? <span className="graph-info-units">{props.units}</span> : <></>

    return (
        <span className="graph-info-data">{props.value}
            {units}
        </span>
    );
}

/**
 * Create bar chart data for commute times
 * @param data
 */
function commuteTimesData(data: CensusMapData) {
    // A mapping of app display labels to corresponding Census
    // data column names
    const columns = new Map<string, {
        total: string,
        male: string,
        female: string
    }>([
        ["Less than 10 minutes", {
            total: 'HC01_EST_VC46',
            male: 'HC02_EST_VC46',
            female: 'HC03_EST_VC46'
        }],
        ["10 to 14 minutes", {
            total: 'HC01_EST_VC47',
            male: 'HC02_EST_VC47',
            female: 'HC03_EST_VC47'
        }],
        ["15 to 19 minutes", {
            total: 'HC01_EST_VC48',
            male: 'HC02_EST_VC48',
            female: 'HC03_EST_VC48'
        }],
        ["20 to 24 minutes", {
            total: 'HC01_EST_VC49',
            male: 'HC02_EST_VC49',
            female: 'HC03_EST_VC49'
        }],
        ["25 to 29 minutes", {
            total: 'HC01_EST_VC50',
            male: 'HC02_EST_VC50',
            female: 'HC03_EST_VC50'
        }],
        ["30 to 34 minutes", {
            total: 'HC01_EST_VC51',
            male: 'HC02_EST_VC51',
            female: 'HC03_EST_VC51'
        }],
        ["35 to 44 minutes", {
            total: 'HC01_EST_VC52',
            male: 'HC02_EST_VC52',
            female: 'HC03_EST_VC52'
        }],
        ["45 to 59 minutes", {
            total: 'HC01_EST_VC53',
            male: 'HC02_EST_VC53',
            female: 'HC03_EST_VC53'
        }],
        ["60 or more minutes", {
            total: 'HC01_EST_VC54',
            male: 'HC02_EST_VC54',
            female: 'HC03_EST_VC54'
        }]
    ]);

    return Array.from(columns.entries()).map(
        ([label, columnNames]) => {
            return {
                name: label,
                male: data[columnNames.male],
                female: data[columnNames.female],
                total: data[columnNames.total]
            }
        }
    );
}

/**
 * Create bar chart data for mode of transportation
 * @param data
 */
function transporationData(data: CensusMapData) {
    // A mapping of app display labels to corresponding Census
    // data column names
    const columns = new Map<string, {
        total: string,
        male: string,
        female: string
    }>([
        ["Driving", {
            total: 'HC01_EST_VC03',
            male: 'HC02_EST_VC03',
            female: 'HC03_EST_VC03'
        }],
        ["Driving (Alone)", {
            total: 'HC01_EST_VC04',
            male: 'HC02_EST_VC04',
            female: 'HC03_EST_VC04'
        }],
        ["Driving (Carpool)", {
            total: 'HC01_EST_VC05',
            male: 'HC02_EST_VC05',
            female: 'HC03_EST_VC05'
        }],
        ["Public Transporation", {
            total: 'HC01_EST_VC10',
            male: 'HC02_EST_VC10',
            female: 'HC03_EST_VC10'
        }],
        ["Walking", {
            total: 'HC01_EST_VC11',
            male: 'HC02_EST_VC11',
            female: 'HC03_EST_VC11'
        }],
        ["Biking", {
            total: 'HC01_EST_VC12',
            male: 'HC02_EST_VC12',
            female: 'HC03_EST_VC12'
        }],
        ["Took Taxi, Motorcycle, or Other", {
            total: 'HC01_EST_VC13',
            male: 'HC02_EST_VC13',
            female: 'HC03_EST_VC13'
        }],
        ["Worked at Home", {
            total: 'HC01_EST_VC14',
            male: 'HC02_EST_VC14',
            female: 'HC03_EST_VC14'
        }]
    ]);

    return Array.from(columns.entries()).map(
        ([label, columnNames]) => {
            return {
                name: label,
                male: data[columnNames.male],
                female: data[columnNames.female],
                total: data[columnNames.total]
            }
        }
    );
}

export default function CountyModal(props: CountyModalProps) {
    const censusData = props.data;
    return (
        <ReactModal isOpen={props.isOpen}
            className="county-modal"
            overlayClassName="county-overlay">
            <header className="modal-header">
                <h1 className="modal-title">{props.data.NAME} {props.data.LSAD}, {props.data.STATE_NAME}</h1>
                <span className="modal-close" onClick={() => props.close()}></span>
            </header>
            <Tabs>
                <React.Fragment key="Commute Times">
                    <div className="graph-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart width={500} height={250} data={commuteTimesData(censusData)}
                                margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis label={{ value: "%", angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#1D1725" />
                                <Bar dataKey="male" fill="#0E65B5" />
                                <Bar dataKey="female" fill="#E1B419" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="graph-info">
                        <GraphInfo title="Workers" subtitle="16 Years or Older">
                            <GraphInfoData value={props.data["HC01_EST_VC01"]} units="Workers" />
                        </GraphInfo>
                        <GraphInfo title="Mean Commute Time" subtitle="Minutes">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Total</th>
                                        <th>Male</th>
                                        <th>Female</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="graph-info-data">{props.data["HC01_EST_VC55"]}</td>
                                        <td className="graph-info-data">{props.data["HC02_EST_VC55"]}</td>
                                        <td className="graph-info-data">{props.data["HC03_EST_VC55"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </GraphInfo>
                        <GraphInfo title="Rank" subtitle="Mean Commute Time (Best to Worst)">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{props.data.STATE_NAME}</th>
                                        <th>Nation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="graph-info-data">{props.data["HC01_EST_VC55_STATE_RANK"]}</td>
                                        <td className="graph-info-data">{props.data["HC01_EST_VC55_RANK"]}
                                            <span style={{ fontWeight: "normal" }}>
                                                /{props.numCounties}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </GraphInfo>
                    </div>
                </React.Fragment>

                <React.Fragment key="Mode of Transportation">
                    <ResponsiveContainer>
                        <BarChart width={730} height={250} data={transporationData(censusData)}
                            margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#1D1725" />
                            <Bar dataKey="male" fill="#0E65B5" />
                            <Bar dataKey="female" fill="#E1B419" />
                        </BarChart>
                    </ResponsiveContainer>
                </React.Fragment>
            </Tabs>
        </ReactModal>
    );}