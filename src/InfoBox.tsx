import { MapControl, MapControlProps, withLeaflet } from "react-leaflet";
import { Control, DomUtil } from "leaflet";
import { CensusMapData, ColumnData } from "./Types";
import React from "react";
import ReactDOM from "react-dom";

interface InfoBoxProps extends MapControlProps {
    column: string;
    columnData: ColumnData;
    data?: CensusMapData;
}

export class InfoBoxContainer extends MapControl {
    createLeafletElement(props: any) { return new Control(); }
    div?: HTMLElement;

    componentDidMount() {
        const legend = new Control({ position: "topright" });
        const _this = this;

        legend.onAdd = () => {
            _this.div = DomUtil.create('div', 'info');
            _this.div.setAttribute('id', 'info-box');
            return _this.div;
        };

        if (this.props.leaflet) {
            const { map } = this.props.leaflet;
            if (map) {
                legend.addTo(map);
            }
        }
    }
}

export function InfoBox(props: InfoBoxProps) {
    const parent = document.getElementById('info-box');
    const data = props.data;
    const subtitle = data ? <h4>{data.NAME} {data.LSAD}, {data.STATE_NAME}</h4> : <></>
    const body = data ? <>{data[props.column]} {props.columnData.units}</>: <></>;

    if (parent) {
        return ReactDOM.createPortal(
            <>
                <div id="variable-changer"></div>
                <div id="county-info">
                    {subtitle}
                    {body}
                </div>
            </>,
            parent
        );
    }

    return <></>
}

export default withLeaflet(InfoBoxContainer);