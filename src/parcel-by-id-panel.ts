import "@vaadin/vaadin-button";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-progress-bar";
import "@vaadin/vaadin-dialog";
import L from "leaflet";
import { css, html, LitElement, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import wellknown from "wellknown/wellknown.js";
import { ULDKapi } from "./uldkAPI";
import "./progress-bar-for-request"
import "./notification-panel"
import {guard} from 'lit/directives/guard.js';
import { DialogOpenedChangedEvent } from "@vaadin/vaadin-dialog";


interface popupElements {
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  id: string;
  parcel: string;
}

@customElement("parcel-id-panel")
export class ParcelByIdPanel extends LitElement {
  static styles = css`
  `;

  @state() dialogOpened: Boolean = false;

  @property({ type: Object }) map?: L.Map;
  @property({ type: Object }) uldkApi: ULDKapi = new ULDKapi();
  @property({ type: Object }) geojsonLayer;

  wktToGeoJSON(wkt: string): GeoJSON.GeometryObject {
    return wellknown(wkt);
  }

  @query("#parcelId")
  parcelIdNode: any;  
  @query("#parcelName")
  parcelNameNode: any;

  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));
  }

  async getParcelById(type: string, teryt: string = "") {

    render(html`<progress-bar-request></progress-bar-request>`, document.body); // render progress-bar

    const dataJSON = await this.uldkApi.getParcelById(type, teryt);

    try {
      render(html``, document.body); // hide progress-bar
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(dataJSON);
      this.map?.fitBounds(this.geojsonLayer.getBounds(), {})
    } catch (error) {
     console.log(error);
    //  this.dialogOpened = true;
     render(html`<notification-panel dialogOpened = ${true}></notification-panel>`, document.body); 
    }
  }

  render() {
    return html`
      <vaadin-text-field
        id="parcelId"
        label="Podaj identyfikator działki"
        helper-text="Format: 141201_1.0001.6509"
        clear-button-visible
        @change=${(e: Event) => {
          if (this.parcelIdNode.value != "") 
            this.parcelNameNode.setAttribute("disabled", "");
          else 
            this.parcelNameNode.removeAttribute("disabled");
        }  
        }
      ></vaadin-text-field>
      <vaadin-text-field
        id="parcelName"
        label="Podaj nazwę i numer działki"
        helper-text="Format: Krzewina 15"
        clear-button-visible
        @change=${(e: Event) =>{
          if (this.parcelNameNode.value != "") 
            this.parcelIdNode.setAttribute("disabled", "");
          else 
            this.parcelIdNode.removeAttribute("disabled");
        }}
      ></vaadin-text-field>
      <vaadin-button
        @click=${async () => {
            if(this.parcelIdNode.value == "") {
              // const str = this.parcelNameNode.value.replace(/ /g, '%20')
              const nazwa = `${this.parcelNameNode.value}`;
              await this.getParcelById("DzialkaNazwa", nazwa);
            } else if (this.parcelNameNode.value == "") {
              const teryt = `${this.parcelIdNode.value}`;
              await this.getParcelById("DzialkaId", teryt);
            }
        }}
        >Szukaj w ULDK</vaadin-button
      >
    `;
  }
}
