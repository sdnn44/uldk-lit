import "@vaadin/vaadin-button";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-progress-bar";
import L from "leaflet";
import { css, html, LitElement, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import wellknown from "wellknown/wellknown.js";
import { ULDKapi } from "./uldkAPI";
import "./parcel-by-id-panel";
import "./parcel-by-click-panel";
import "./parcel-by-details-panel";
import "@vaadin/vaadin-notification";
import { guard } from "lit/directives/guard.js";

// import "@vaadin/notification"
// import { NotificationElement } from "@vaadin/vaadin-notification";
import { NotificationElement } from "@vaadin/vaadin-notification";
import type { NotificationOpenedChangedEvent } from "@vaadin/vaadin-notification";
// import { Notification } from "@vaadin/notification";

@customElement("notification-panel")
export class NotificationPanel extends LitElement {
  static styles = css``;

  @property({ type: Object }) dialogOpened!: Boolean;

  @property({ type: Object }) map?: L.Map;
  @property({ type: Object }) selectedMode!: String;
  @property({ type: Object }) uldkApi: ULDKapi = new ULDKapi();

  async firstUpdated(props: any) {
    super.firstUpdated(props);
    await new Promise((r) => setTimeout(r, 0));
    console.log("Notification panel!");
    
  }

  render() {
    return html`
      <vaadin-dialog
        aria-label="System maintenance notice"
        .opened="${this.dialogOpened}"
        @opened-changed="${(e: CustomEvent) =>
          (this.dialogOpened = e.detail.value)}"
        .renderer="${guard([], () => (root: HTMLElement) => {
          render(
            html`
              <vaadin-vertical-layout
                theme="spacing"
                style="width: 300px; max-width: 100%; align-items: stretch;"
              >
                <h2
                  style="margin: var(--lumo-space-m) 0; font-size: 1.5em; font-weight: bold;"
                >
                  Błąd
                </h2>
                <p>
                  Wyszukiwanie działki na podstawie podanych parametrów nie
                  powiodło się. <br />
                  Spróbuj ponownie, tym razem wprowadzając poprawne dane.
                </p>
                <vaadin-button
                  @click="${() => (this.dialogOpened = false)}"
                  style="align-self: flex-end;"
                >
                  Zamknij
                </vaadin-button>
              </vaadin-vertical-layout>
            `,
            root
          );
        })}"
      ></vaadin-dialog>
    `;
  }
}
