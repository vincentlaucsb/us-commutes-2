import { MapControl, MapControlProps, withLeaflet } from "react-leaflet";
import React from "react";
import { Control, DomUtil } from "leaflet";
import { Columns } from "./Types";
import ReactDOM from "react-dom";

interface VariableChangerProps extends MapControlProps {
    updateColumn: (colName: string) => void;
}

export function VariableSelector(props: VariableChangerProps) {
    const parent = document.getElementById('variable-changer');
    const options = Array.from(Columns.entries()).map(
        ([key, data]) =>
            <option key={key} value={key}>{data.label}</option>
    );

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.updateColumn(event.target.value);
    }

    if (parent) {
        return ReactDOM.createPortal(
            <>
                <label>Variable of Interest</label>
                <select onChange={handleChange}>
                    {options}
                </select>
            </>,
            parent
        );
    }

    return <></>
}

class VariableChanger extends MapControl {
    createLeafletElement(props: any) { return new Control(); }

    componentDidMount() {
        const legend = new Control({ position: "bottomleft" });
        legend.onAdd = function () {
            var div = DomUtil.create('div', 'info');
            div.setAttribute('id', 'variable-changer');
            return div;
        };

        if (this.props.leaflet) {
            const { map } = this.props.leaflet;
            if (map) {
                legend.addTo(map);
            }
        }
    }
}

export default withLeaflet(VariableChanger);