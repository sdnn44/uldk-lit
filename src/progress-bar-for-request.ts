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

@customElement("progress-bar-request")
export class ProgressBarRequest extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      heigth: 100%;
      background-color: black;
    }
    #progressbar {
      position: absolute;
      top: 40%;
      left: 38%;
      padding: 1rem;
      width: 270px;
      background-color: white;
      border: 1px solid rgb(22, 118, 243);
    }
    #overlay {
      position: fixed;
      display: block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.4);
      z-index: 1;
    }

  `;
  @property({ type: Object }) map?: L.Map;
  @property({ type: Object }) selectedMode!: String;
  @property({ type: Object }) uldkApi: ULDKapi = new ULDKapi();
  @property({ type: Object }) geojsonLayer;

  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));
    console.log("Progress bar!");
  }
  
  render() {
        return html`
          <div id="overlay"><div id="progressbar">
            <div style="color: var(--lumo-secondary-text-color);">
              <div>Wyszukiwanie działki...</div>
              <vaadin-progress-bar indeterminate></vaadin-progress-bar>
              <div style="font-size: var(--lumo-font-size-xs)">
                Proces może zająć chwilę
              </div>
            </div>
          </div>
        </div>
        `
      }
}
