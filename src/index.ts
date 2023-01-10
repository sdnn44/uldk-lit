import L from "leaflet";
import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "./uldk-panel"
import "./button-panel"
import "./progress-bar-for-request"

@customElement("main-panel")
export class MainPanel extends LitElement {
  static styles = css``;

  @state() map?: L.Map;
  @state() geojsonLayer: any = undefined;

  @state() basemap?: L.TileLayer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "OpenStreetMap",
    }
  );

  initMap() {
    this.map = new L.Map("map", {
      center: new L.LatLng(51.236525, 22.4998601),
      zoom: 18,
    });
  }

  addGeojsonToMap() {
    if (!this.geojsonLayer) {
      console.log("GeoJSON Layer has been created!");
      
      this.geojsonLayer = L.geoJSON(undefined, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            ` <p><b>Województwo: </b> ${feature.properties.voivodeship}
              <p><b>Powiat: </b> ${feature.properties.county}
              <p><b>Gmina: </b> ${feature.properties.commune}
              <p><b>Miejscowość: </b> ${feature.properties.region}
              <p><b>Identyfikator działki: </b> ${feature.properties.id}
              <p><b>Numer działki: </b>${feature.properties.parcel}
            `
            );
        }
      }).addTo(this.map!);
    }
  }

  firstUpdated(props: any) {
    super.firstUpdated(props);
    this.initMap();
    this.basemap?.addTo(this.map!);
    this.addGeojsonToMap();
  }

  render() {
    return html`
      <!-- <progress-bar-request></progress-bar-request> -->
      <button-panel .map=${this.map} .geojsonLayer=${this.geojsonLayer}></button-panel>`;
  }
}

/*
  1. Wydzielić pierwszy panel do nowej klasy; - done
  2. Generalizacja geojsonLayer do jednej metody i naprawa zbudlowanych warstw; - done
  3. Aktualizacja vaadin; - niekonieczna
  4. Notyfikacje o nieistniejących działkach; - done
  5. Włączenie/wyłączenie przycisku + style; - niepotrzebne

  99. Może zmiana radiobuttonów na coś ładniejszego;
*/