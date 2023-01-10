import "@vaadin/vaadin-button";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-progress-bar";
import L from "leaflet";
import { css, html, LitElement, nothing, render } from "lit";
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

@customElement("parcel-detail-panel")
export class ParcelByDetailsPanel extends LitElement {
  static styles = css`
  `;

  @state() dialogOpened: Boolean = false;

  @property({ type: Object }) map?: L.Map;
  @property({ type: Object }) uldkApi: ULDKapi = new ULDKapi();

  @property({ type: Object }) geojsonLayer?: any;

  wktToGeoJSON(wkt: string): GeoJSON.GeometryObject {
    return wellknown(wkt);
  }

  @query("#voivodeship")
  voivodeshipNode: any;

  @query("#county")
  countyNode: any;

  @query("#commune")
  communeNode: any;

  @query("#region")
  regionNode: any;

  @query("#parcel")
  parcelNode: any;
  

  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));
    // console.log(this.map);
  }

  async getParcelById(type: string, teryt: string = "") {

    render(html`<progress-bar-request></progress-bar-request>`, document.body); 
    
    const dataJSON = await this.uldkApi.getParcelById(type, teryt);

    try {
      render(``, document.body); 
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(dataJSON);
      this.map?.fitBounds(this.geojsonLayer.getBounds(), {})
    } catch (error) {
      console.log(error);
      
      render(html`<notification-panel dialogOpened = ${true}></notification-panel>`, document.body); 
    }
  }

  render() {
    return html`
        <vaadin-combo-box
            id="voivodeship"
            item-label-path="name"
            item-value-path="teryt"
            clear-button-visible
            label="Wybierz województwo"
            @selected-item-changed=${(e) => {
              this.countyNode.value = "";
              this.countyNode.items = [];
              this.countyNode.selectedItem = undefined;
            }}
            .dataProvider=${async (params, callback) => {
              let { filter } = params;
              let data = await this.uldkApi.getAdministrativeNames(
                "Wojewodztwo"
              );
              callback(data, data.length);
            }}
            @change=${async (e) => {
              this.countyNode.items = await this.uldkApi.getAdministrativeNames(
                "Powiat",
                e.target.value
              );
            }}
            }
          ></vaadin-combo-box>
          <vaadin-combo-box
            id="county"
            item-label-path="name"
            item-value-path="teryt"
            clear-button-visible
            label="Wybierz powiat"
            @selected-item-changed=${(e) => {
              this.communeNode.value = "";
              this.communeNode.items = [];
              this.communeNode.selectedItem = undefined;
            }}
            @change=${async (e) => {
              this.communeNode.items =
                await this.uldkApi.getAdministrativeNames(
                  "Gmina",
                  e.target.value
                );
            }}
            }
          ></vaadin-combo-box>
          <vaadin-combo-box
            id="commune"
            item-label-path="name"
            item-value-path="teryt"
            clear-button-visible
            label="Wybierz gminę"
            @selected-item-changed=${(e) => {
              this.regionNode.value = "";
              this.regionNode.items = [];
              this.regionNode.selectedItem = undefined;
            }}
            @change=${async (e) => {
              this.regionNode.items = await this.uldkApi.getAdministrativeNames(
                "Region",
                e.target.value
              );
            }}
          ></vaadin-combo-box>
          <vaadin-combo-box
            id="region"
            item-label-path="name"
            item-value-path="teryt"
            clear-button-visible
            label="Wybierz region"
          ></vaadin-combo-box>
          <vaadin-text-field
            id="parcel"
            label="Podaj nr działki"
          ></vaadin-text-field>
          <vaadin-button
            @click=${async (e) => {
              const teryt = `${this.regionNode.value}.${this.parcelNode.value}`;
              try {
                // render(html`<progress-bar-request></progress-bar-request>`, document.body); 
              } finally {
                await this.getParcelById("Dzialka", teryt); 
                // render(``, document.body); 
            }
            }}
            >Szukaj w ULDK</vaadin-button>
    `;
  }
}
