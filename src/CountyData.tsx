import { StyleFunction } from "leaflet";
import { GeoJSON } from "react-leaflet";
import { GeoJsonObject } from "geojson";
import React from "react";
import { PercentileData, CensusMapData } from "./Types";
import { getFillColor } from "./Helpers";

interface CountyDataProps {
    activeCounty?: string;
    column: string;
    data: GeoJsonObject;
    percentiles: PercentileData;
    openModal: () => void;
    updateActiveCounty: (geoId: string) => void;
    updateActiveCountyData: (data: CensusMapData) => void;
}

export default function CountyData(props: CountyDataProps) {
    const styleCounty: StyleFunction = (feature: any) => {
        const isActive = props.activeCounty === feature.properties.GEO_ID;

        return {
            fillColor: getFillColor(
                feature.properties[props.column] as number,
                props.percentiles
            ),
            fillOpacity: 0.8,
            stroke: isActive
        }
    };

    return (
        <GeoJSON
            onEachFeature={(feature, layer) =>
                layer.on({
                    click: () => {
                        props.openModal();
                    },
                    mouseover: () => {
                        props.updateActiveCounty(feature.properties.GEO_ID);
                        props.updateActiveCountyData(feature.properties);
                    }
                })}
            data={props.data}
            style={styleCounty} />
    );
}