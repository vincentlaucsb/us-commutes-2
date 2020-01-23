import { MapControl, MapControlProps, withLeaflet } from "react-leaflet";
import { Control, DomUtil } from "leaflet";
import { CensusMapData, ColumnData } from "./Types";

interface InfoBoxProps extends MapControlProps {
    column: string;
    columnData: ColumnData;
    data: CensusMapData;
}

export class InfoBox extends MapControl<InfoBoxProps> {
    createLeafletElement(props: any) { return new Control(); }
    div?: HTMLElement;

    componentDidMount() {
        const legend = new Control({ position: "topright" });
        const data = this.props.data;
        const _this = this;

        legend.onAdd = () => {
            _this.div = DomUtil.create('div', 'info');
            this.populate();
            return _this.div;
        };
        
        if (this.props.leaflet) {
            const { map } = this.props.leaflet;
            if (map) {
                legend.addTo(map);
            }
        }
    }

    componentDidUpdate(prevProps: InfoBoxProps) {
        const data = this.props.data;
        if (prevProps.data.GEO_ID !== this.props.data.GEO_ID) {
            this.populate();
        }
    }

    /** Populate the info box */
    populate() {
        const data = this.props.data;
        if (this.div) {
            const header = `<hgroup>
<h4>${this.props.columnData.label}</h4>
<h5>${data.NAME} ${data.LSAD}</h5>
</hgroup>`;
            const body = `${data[this.props.column]}
${this.props.columnData.units}`

            this.div.innerHTML = `${header} ${body}`
        }
    }
}

export default withLeaflet<InfoBoxProps>(InfoBox);