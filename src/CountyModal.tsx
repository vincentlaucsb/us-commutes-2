import { BarChart, CartesianGrid, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CensusMapData } from "./Types";
import ReactModal from "react-modal";
import React from 'react';

interface CountyModalProps {
    close: () => void;

    isOpen: boolean;
    data: CensusMapData;
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
        <ReactModal isOpen={props.isOpen}>
            <h2>{props.data.NAME} {props.data.LSAD}, {props.data.STATE_NAME}</h2>
            <h3>Commute Times</h3>
            <BarChart width={730} height={250} data={commuteTimesData(censusData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
                <Bar dataKey="male" fill="#8884d8" />
                <Bar dataKey="female" fill="#82ca9d" />
            </BarChart>

            <h3>Mode of Transportation</h3>
            <BarChart width={730} height={250} data={transporationData(censusData)}>
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