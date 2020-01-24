import { BarChart, CartesianGrid, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CensusMapData } from "./Types";
import ReactModal from "react-modal";
import React from 'react';

interface CountyModalProps {
    close: () => void;

    isOpen: boolean;
    data: CensusMapData;
}

export default function CountyModal(props: CountyModalProps) {
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

    const censusData = props.data;

    const data = Array.from(columns.entries()).map(
        ([label, columnNames]) => {
            return {
                name: label,
                male: censusData[columnNames.male],
                female: censusData[columnNames.female],
                total: censusData[columnNames.total]
            }
        }
    );

    return (
        <ReactModal isOpen={props.isOpen}>
            <h2>{props.data.NAME} {props.data.LSAD}, {props.data.STATE_NAME}</h2>
            <BarChart width={730} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
                <Bar dataKey="male" fill="#8884d8" />
                <Bar dataKey="female" fill="#82ca9d" />
            </BarChart>
            <button onClick={() => props.close()}>Close</button>
        </ReactModal>
    );}