import React, { Component } from "react";

import "./App.css";
import "ol/ol.css";
import "antd/dist/antd.css";
import "./react-geo.css";

import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";
import OlSourceXYZ from "ol/source/XYZ";
import OlSourceVector from "ol/source/Vector"
import OlFormatGeoJSON from "ol/format/GeoJSON"
import VectorLayer from 'ol/layer/Vector'
import OLSourceTileWMS from "ol/source/TileWMS";
import OlLayerGroup from "ol/layer/Group";

import { Drawer } from "antd";
import {
  SimpleButton,
  MapComponent,
  NominatimSearch,
  MeasureButton,
  LayerTree,
  MapProvider,
  mappify,
  onDropAware
} from "@terrestris/react-geo";

const MappifiedNominatimSearch = mappify(NominatimSearch);
const MappifiedMeasureButton = mappify(MeasureButton);
const MappifiedLayerTree = mappify(LayerTree);
const Map = mappify(onDropAware(MapComponent));

const layer = new OlLayerTile({
  source: new OlSourceOsm(),
  name: "OSM"
});

const topoLayer = new OlLayerTile({
  title: 'OSM',
  type: 'base',
  visible: true,
  source: new OlSourceXYZ({
      url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
  })
});   



const idrometri = new VectorLayer({
  name: 'IDROMETRI',
  source: new OlSourceVector({
    url:
      "http://a-alai:8080/geoserver/Arpas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Arpas:idrometri&maxFeatures=2000&outputFormat=application%2Fjson",
    format: new OlFormatGeoJSON(),
    crossOrigin: "anonymous"
  })
});
console.log(idrometri)

const mybase = "http://webgis.regione.sardegna.it/geoserver/ows";
const litologia = new OlLayerTile({
  name: 'LITOLOGIA',
  source: new OLSourceTileWMS({
    url: mybase,
    params: {
      LAYERS: "dbu:carta_litologica2019",
      TILED: true,
      styles: "quadriUnione"
    },
    serverType: "geoserver"
  })
});

const layerGroup = new OlLayerGroup({
  name: "Arpas",
  layers: [
    litologia,
    idrometri
  ]
});

const center = [1000000, 4900000];
const map = new OlMap({
  view: new OlView({
    center: center,
    zoom: 8
  }),
  layers: [topoLayer, layerGroup]
});

map.on("postcompose", map.updateSize);

class App extends Component {
  state = { visible: false };

  toggleDrawer = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    return (
      <div className="App">
        <MapProvider map={map}>
          <Map />
          <Drawer
            title="react-geo-application"
            placement="right"
            onClose={this.toggleDrawer}
            visible={this.state.visible}
            mask={false}
          >
            <MappifiedNominatimSearch key="search" />
            <MappifiedMeasureButton
              key="measureButton"
              name="line"
              measureType="line"
              icon="pencil"
            >
              Strecke messen
            </MappifiedMeasureButton>
            <MappifiedLayerTree layerGroup={layerGroup} />
          </Drawer>
          <div
            style={{ position: "fixed", top: "30px", right: "30px" }}
            onClick={this.toggleDrawer}
          />
          <SimpleButton
            style={{ position: "fixed", top: "80px", right: "80px" }}
            onClick={this.toggleDrawer}
            icon="bars"
          />
        </MapProvider>
      </div>
    );
  }
}

export default App;
