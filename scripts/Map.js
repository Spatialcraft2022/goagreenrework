// Import required modules and CSS
import 'ol/ol.css';
import { Map, View } from 'ol/';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import { OSM } from 'ol/source';
import { ScaleLine, defaults as defaultControls } from 'ol/control.js';
import XYZ from 'ol/source/XYZ.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';


import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import Style from 'ol/style/Style';

import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

// ScaleLine control
let control = new ScaleLine({
    units: 'metric',
    steps: 1,
    bar: true,
    text: true,
    minWidth: 100,
    className: 'scale',
});

// Basemaps
const Osmlayer = new TileLayer({
    source: new OSM(),
    visible: false,
    name: 'OSM',
});

const googlesatellite = new TileLayer({
    source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
    }),
    visible: true,
    name: "Google Satellite"
});

const customPolygonStyle = new Style({
    fill: new Fill({
      color: 'rgba(235, 16, 16, 0)', // semi-transparent dark red fill
    }),
    stroke: new Stroke({
      color: 'rgba(225, 20, 20, 0)', // solid red border
      width: 10, // border width
    }),
  });



  // WFS vector layer
// WFS vector layer with custom style
/*
const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return 'https://reservemyplot.com/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&MAXFEATURES=4000&TYPENAME=plotting&SRSNAME=EPSG:32643&outputFormat=application/json&map=/home/qgis/goagreen/goagreen.qgs' +
        '&BBOX=' + extent.join(',') + ',EPSG:32643'; // Corrected concatenation of bbox
    },
    strategy: bboxStrategy,
  

  });
  
  // Vector layer using the vector source and applying the custom style
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    visible:true,
    name:"WFS",
    style: customPolygonStyle // Apply the custom style
  });

*/




// Projection setup
proj4.defs('EPSG:32643', '+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs');
register(proj4);
const mapProjection2 = getProjection('EPSG:32643');

// Primary raster layer - will be replaced by bash script

const ortholayer = new TileLayer({
    source: new TileWMS({
        url: 'https://reservemyplot.com/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/goagreen/goagreen.qgs&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=goagreencog&FORMAT=image/png&STYLE=default',
    }),
    opacity: 1,
    name: 'Map',
});

/*const soldplots = new ImageLayer({
    source: new ImageWMS({
        url: 'https://reservemyplot.com/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/goagreen/goagreen.qgs&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=sold&FORMAT=image/png&STYLE=default',  // <-- This should be inside an object
    }),
    visible: true,
    name: "Sold Plots",
});
  



const availableplan = new ImageLayer({
    source: new ImageWMS({
        url: 'https://reservemyplot.com/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/goagreen/goagreen.qgs&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=available&FORMAT=image/png&STYLE=default',  // <-- This should be inside an object
    }),
    visible: true,
    name: "Available Plots",
});*/

const plotslayer = new ImageLayer({
    source: new ImageWMS({
        url: 'https://reservemyplot.com/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/goagreen/goagreen.qgs&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=plots&FORMAT=image/png&STYLE=default',  // <-- This should be inside an object
        params:{ "TILED": true },
        
    }),
    visible: true,
    name: "Plot Boundary",
    graphic:""

});

// View configuration
const centerCoordinates = centerpoint.split(',').map(parseFloat);
const isMobile = window.innerWidth <= 600;
const zoomLevel = isMobile ? 15 : 16.6;

const view1 = new View({
    center: centerCoordinates,
    zoom: zoomLevel,
    multiWorld: false,
    projection: mapProjection2,
});

// Map configuration
const map = new Map({
    //controls: defaultControls().extend([control]),
    target: "map",
    layers: [
        googlesatellite,
        Osmlayer,
        ortholayer,plotslayer,
    //vectorLayer
    // more boundslayers injected dynamically if needed
    ],
    view: view1,
});

// Store map reference for later
$('#map').data('map', map);
