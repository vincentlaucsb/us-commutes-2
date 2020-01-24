import { MapControl, MapControlProps, withLeaflet } from "react-leaflet";
import React from "react";
import { Control, DomUtil } from "leaflet";
import { CensusMapData, PercentileData, Columns } from "./Types";
import ReactDOM from "react-dom";
import { FillColor } from "./Helpers";

/** See:
 * https://stackoverflow.com/questions/57403442/how-to-add-a-legend-to-the-map-using-react-leaflet-without-using-refs-and-manua
 * https://codesandbox.io/s/how-to-add-a-legend-to-the-map-using-react-leaflet-6yqs5
 */
class MapLegendContainer extends MapControl {
    createLeafletElement(props: any) { return new Control(); }

    componentDidMount() {
        const legend = new Control({ position: "bottomright" });
        legend.onAdd = function () {
            var div = DomUtil.create('div', 'info');
            div.setAttribute('id', 'legend');
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

interface MapLegendProps {
    column?: string;
    data?: CensusMapData;
    percentiles?: PercentileData;
}

export function MapLegend(props: MapLegendProps) {
    const parent = document.getElementById('legend');
    const percentiles = Array.from(FillColor.keys());

    const getColor = (percent: number) => {
        const color = FillColor.get(percent);
        if (!color) {
            throw new Error(`No color found for ${percent}`);
        }

        return color;
    }

    let header = <></>
    if (props.column) {
        let columnData = Columns.get(props.column);
        if (columnData) {
            header = <h4>{columnData.units}</h4>
        }
    }

    let children: any = <></>
    const percentileData = props.percentiles;
    if (percentileData) {
        children = percentiles.map(
            (pct: number, index: number, arr: number[]) => {
                const lowerBound = (index === 0) ?
                    0 : percentileData[percentiles[index - 1]];
                const label = (pct === 1) ?
                    `${lowerBound}+` :
                    `${lowerBound} -- ${percentileData[pct]}`;

                return (
                    <>
                        <i className="legend-swatch"
                            style={{ backgroundColor: getColor(pct) }}></i>
                        {label} 
                        <br />
                    </>
                );
            }
        )
    }

    if (parent) {
        return ReactDOM.createPortal(
            <>
                {header}
                {children}
            </>,
            parent
        );
    }

    return <></>
}

export default withLeaflet(MapLegendContainer);