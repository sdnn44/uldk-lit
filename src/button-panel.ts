import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@vaadin/vaadin-radio-button/vaadin-radio-button.js";
import "@vaadin/vaadin-radio-button/vaadin-radio-group.js";

@customElement("button-panel")
export class ButtonPanel extends LitElement {

constructor() {
    super();
    // this.selectedMode = 'pracelByOptions';
}

  static styles = css`
  :host {
    position: absolute;
    top: .2rem;
    right: .2rem;
    padding: 1rem;
    // background-color: #e0e0d1;
    width: 270px;
    background-color: white;
    border: 1px solid rgb(22, 118, 243);
    z-index: 2;
  }
  
  vaadin-radio-button{
    font-size: 15px;
  }
  `;
  
  @state() selectedMode?: String = 'parcelByOptions';
  
  @property({ type: Object }) map?: L.Map; 
  @property({ type: Object }) geojsonLayer;

  render() {
    return html`
      <vaadin-radio-group 
        label="Wyszukaj obiekt poprzez: "
        theme="vertical"
        @value-changed="${this._onValueChanged}" .value="${this.selectedMode}" 
        >
            <vaadin-radio-button
            value="parcelByOptions"
            label="Identyfikator szukanego obiektu"
            >Wybrane elementy identyfikatora</vaadin-radio-button>
            <vaadin-radio-button
            value="parcelById"
            label="Pełen identyfikator działki lub nazwę obrębu i numer działki"
            >Pełen identyfikator</vaadin-radio-button>
            <vaadin-radio-button
            value="parcelByClick"
            label="Współrzędne (wyszukanie obiektu we wskazanym punkcie)"
            >Wskazany punkt</vaadin-radio-button>
      </vaadin-radio-group>
      <uldk-panel .map=${this.map} .geojsonLayer = ${this.geojsonLayer} .selectedMode=${this.selectedMode}></uldk-panel>
    `;
  }
  _onValueChanged(e) {
    this.selectedMode = e.detail.value;
    if(e.detail.value !== 'parcelByClick')
      this.map?.off('click');
  }
}
