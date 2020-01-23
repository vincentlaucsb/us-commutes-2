import { MapControl, MapControlProps, withLeaflet } from "react-leaflet";
import React from "react";
import { Control, DomUtil } from "leaflet";

/** See:
 * https://stackoverflow.com/questions/57403442/how-to-add-a-legend-to-the-map-using-react-leaflet-without-using-refs-and-manua
 * https://codesandbox.io/s/how-to-add-a-legend-to-the-map-using-react-leaflet-6yqs5
 */
export class Legend extends MapControl {
    createLeafletElement(props: any) { return new Control(); }

    componentDidMount() {
        const legend = new Control({ position: "bottomright" });
        legend.onAdd = function () {
            var div = DomUtil.create('div', 'info legend'),
                labels = [];
            div.innerHTML = "asdf";
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

export default withLeaflet(Legend);