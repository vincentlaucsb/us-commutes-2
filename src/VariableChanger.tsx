import { MapControlProps } from "react-leaflet";
import React from "react";
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
            <select onChange={handleChange}>
                {options}
            </select>,
            parent
        );
    }

    return <></>
}