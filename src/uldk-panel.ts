import "@vaadin/vaadin-button";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-progress-bar";
import L from "leaflet";
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import wellknown from "wellknown/wellknown.js";
import { ULDKapi } from "./uldkAPI";
import "./parcel-by-id-panel";
import "./parcel-by-click-panel";
import "./parcel-by-details-panel";
import "@vaadin/vaadin-notification"
// import "@vaadin/notification"
// import { NotificationElement } from "@vaadin/vaadin-notification";
import { NotificationElement } from "@vaadin/vaadin-notification"
import type { NotificationOpenedChangedEvent } from "@vaadin/vaadin-notification"
// import { Notification } from "@vaadin/notification";

interface uldkItem {
  name: string;
  teryt: string;
}

@customElement("uldk-panel")
export class ULDKPanel extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: 10rem;
      left: -1px;
      padding: 1rem;
      background-color: white;
      border: 1px solid rgb(22, 118, 243);
      width: 270px;
      min-height: 300px;
      overflow: auto;
      z-index: 2;
    }

    vaadin-text-field {
      width: 100%;
    }

    vaadin-combo-box {
      width: 100%;
    }
  `;

  @property({ type: Object }) map?: L.Map;
  @property({ type: Object }) selectedMode!: String;
  @property({ type: Object }) uldkApi: ULDKapi = new ULDKapi();
  @property({ type: Object }) geojsonLayer;

  @query("#map")
  _progressBarNode!: HTMLDivElement;

  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));
  }
  
  render() {
    switch (this.selectedMode) {
      
      case "parcelByClick": {
        return html`
          <parcel-click-panel .map = ${this.map} .geojsonLayer = ${this.geojsonLayer}></parcel-click-panel>
          <style>
            :host {
              display: none;
            }
          </style>
        `
      }

      case "parcelById": {
        return html` 
          <h4>Pobieranie działek</h4>
          <parcel-id-panel .map = ${this.map} .geojsonLayer = ${this.geojsonLayer}></parcel-id-panel>`;
      }

      case "parcelByOptions": {
        return html`
          <h4>Pobieranie działek</h4>
          <parcel-detail-panel .map = ${this.map} .geojsonLayer = ${this.geojsonLayer}></parcel-detail-panel>
        `;
      }
    }
  }
}
