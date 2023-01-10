import "@vaadin/vaadin-button";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-progress-bar";
import L from "leaflet";
import { css, html, LitElement, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import wellknown from "wellknown/wellknown.js";
import { ULDKapi } from "./uldkAPI";
import "./progress-bar-for-request"
import "./notification-panel"



interface popupElements {
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  id: string;
  parcel: string;
}

@customElement("parcel-click-panel")
export class ParcelByClickPanel extends LitElement {
  static styles = css`
  `;
  
  @state() dialogOpened: Boolean = false;

  @property({ type: Object }) map?: L.Map;
  @property({ type: Object }) uldkApi: ULDKapi = new ULDKapi();
  @property({ type: Object }) geojsonLayer;

  wktToGeoJSON(wkt: string): GeoJSON.GeometryObject {
    return wellknown(wkt);
  }

  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));

  }

  async getParcelByClick() {

    this.map?.on('click', async (event: L.LeafletMouseEvent) => {

      render(html`<progress-bar-request></progress-bar-request>`, document.body); 
      
      let coordinates = `${event.latlng.lng},${event.latlng.lat}`;

      const dataJSON = await this.uldkApi.getParcelById("DzialkaXY", coordinates);
  
      try {
        render(html``, document.body); 
        this.geojsonLayer.clearLayers();
        this.geojsonLayer.addData(dataJSON);
        this.map?.fitBounds(this.geojsonLayer.getBounds(), {})
      } catch (error) {
        console.log(error);
        render(html`<notification-panel dialogOpened = ${true}></notification-panel>`, document.body); 
      }
    });
  }

  render() {
    return html`${this.getParcelByClick()};`;
  }
}
