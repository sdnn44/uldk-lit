import "@vaadin/vaadin-button";
import "@vaadin/vaadin-combo-box";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-progress-bar";
import L from "leaflet";
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import wellknown from "wellknown/wellknown.js";

interface uldkItem {
  name: string;
  teryt: string;
}

interface popupElements {
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  id: string;
  parcel: string;
}

@customElement("uldk-api")
export class ULDKapi extends LitElement {
  constructor() {
    super();
  }

  @state() search_types_by_option = {
    Wojewodztwo: {
      param: "GetVoivodeshipById",
      result: "voivodeship",
    },
    Powiat: {
      param: "GetCountyById",
      result: "county",
    },
    Gmina: {
      param: "GetCommuneById",
      result: "commune",
    },
    Region: {
      param: "GetRegionById",
      result: "region",
    },
    Dzialka: {
      param: "GetParcelById",
      result: "geom_wkt",
    },
    DzialkaId: {
      param: "GetParcelByIdOrNr",
      result: "geom_wkt",
    },
    DzialkaNazwa: {
      param: "GetParcelByIdOrNr",
      result: "geom_wkt",
    },
    DzialkaXY: {
      param: "GetParcelByXY",
      result: "geom_wkt",
    }
    //getparcelbyid - 141201_1.0001.6509
  };

  wktToGeoJSON(wkt: string): GeoJSON.GeometryObject {
    return wellknown(wkt);
  }

  async getAdministrativeNames(type: string, teryt: string = "") {
    const url = `https://uldk.gugik.gov.pl/?request=${this.search_types_by_option[type].param}&result=teryt,${this.search_types_by_option[type].result}&id=${teryt}`;
    const text = await fetch(url).then((r) => r.text());
    const result = text.substring(1).trim();
    const arr = result.split("\n");

    let items: uldkItem[] = [];

    arr.forEach((item) => {
      const itemSplit = item.split("|");
      items.push({ name: itemSplit[1], teryt: itemSplit[0] });
    });
    
    return items;
  }

  async getParcelById(type: string, teryt: string = "") {

    let url: string;

    if(type === 'DzialkaXY'){
      url = `https://uldk.gugik.gov.pl/?request=${this.search_types_by_option[type].param}&result=${this.search_types_by_option[type].result},voivodeship,county,commune,region,id,parcel&xy=${teryt},4326&srid=4326`;
    }
      else {
      url = `https://uldk.gugik.gov.pl/?request=${this.search_types_by_option[type].param}&result=${this.search_types_by_option[type].result},voivodeship,county,commune,region,id,parcel&id=${teryt}&srid=4326`;
    }
    
    const text = await fetch(url).then((r) => r.text());

    console.log(`First element: ${text.charAt(0)}`);
    
    let result: string = text.substring(1).trim();

    if (text.charAt(0) !== "1") { // Nazwa i numer działki Krzewina 14 zwraca dwa wyniki dopisując tym samym POLYGON drugiej działki do popup'u.
      result = result.split("\n")[0]
    }

    const wkt = (result.includes(";") ? result.split(";")[1] : result)
      ?.trim()
      .split("\n")[0];

    console.log(wkt);
      
    let items: popupElements[] = [];
    const arr = result.split("|");

    items.push({
      voivodeship: arr[1],
      county: arr[2],
      commune: arr[3],
      region: arr[4],
      id: arr[5],
      parcel: arr[6]
    }); 

    console.log(url);
    
    console.log(items[0].parcel);
    

    const wktJSON = this.wktToGeoJSON(wkt);

    const dataJSON = {
      type: "FeatureCollection",
      features: [
          {
            type: "Feature",
            geometry: wktJSON,
            properties: {
              voivodeship: items[0].voivodeship,
              county: items[0].county,
              commune: items[0].commune,
              region: items[0].region,
              id: items[0].id,
              parcel: items[0].parcel
            },
            id: 1,
          },
        ],
      };
      return dataJSON;
  }
}
