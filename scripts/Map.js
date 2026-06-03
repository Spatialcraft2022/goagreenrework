import 'ol/ol.css';
import { Map, View } from 'ol/';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import { Image as ImageLayer } from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import { OSM } from 'ol/source';
import XYZ from 'ol/source/XYZ.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';

// ── WMS base URL ────────────────────────────────────────────────────────────
const WMS_URL = 'https://reservemyplot.com/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/goagreen/goagreen.qgs';

// ── Projection (must be set up BEFORE any layer that uses it) ────────────────
proj4.defs('EPSG:32643', '+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs');
register(proj4);
const mapProjection = getProjection('EPSG:32643');
// Explicit extent lets OL build a correct tile grid for TileWMS
mapProjection.setExtent([166022, 0, 833978, 9329005]);

// ── Basemaps ─────────────────────────────────────────────────────────────────
const Osmlayer = new TileLayer({
    source: new OSM(),
    visible: false,
    preload: 0,
    transition: 0,
    name: 'OSM',
});

const googlesatellite = new TileLayer({
    source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        crossOrigin: 'anonymous',
        maxZoom: 22,
    }),
    visible: true,
    preload: 0,
    transition: 0,
    name: 'Google Satellite',
});

// ── WMS layers ───────────────────────────────────────────────────────────────
const ortholayer = new TileLayer({
    source: new TileWMS({
        url: WMS_URL,
        params: { LAYERS: 'goagreencog', TILED: true, FORMAT: 'image/png' },
        serverType: 'qgis',
        crossOrigin: 'anonymous',
        tileSize: [512, 512],
        projection: mapProjection,
    }),
    visible: true,
    preload: 0,
    transition: 0,
    name: 'Map',
    graphic: './maplegend.png',
});

const plotslayer = new ImageLayer({
    source: new ImageWMS({
        url: WMS_URL,
        params: { LAYERS: 'plots', TRANSPARENT: true, FORMAT: 'image/png' },
        serverType: 'qgis',
        crossOrigin: 'anonymous',
        ratio: 1,
    }),
    visible: true,
    name: 'Plot Boundary',
    graphic: '',
});

// ── View ─────────────────────────────────────────────────────────────────────
const centerCoordinates = centerpoint.split(',').map(parseFloat);
const isMobile = window.innerWidth <= 600;

const view1 = new View({
    center: centerCoordinates,
    zoom: isMobile ? 15 : 16.6,
    multiWorld: false,
    projection: mapProjection,
});

// ── Map ───────────────────────────────────────────────────────────────────────
const map = new Map({
    controls: [],
    target: 'map',
    layers: [googlesatellite, Osmlayer, ortholayer, plotslayer],
    view: view1,
});

$('#map').data('map', map);
