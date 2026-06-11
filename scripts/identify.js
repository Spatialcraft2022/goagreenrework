// Import required modules and CSS
import 'ol/ol.css';
import Overlay from 'ol/Overlay.js';
import { toLonLat } from 'ol/proj.js';
import { toStringHDMS } from 'ol/coordinate.js';
import { getLayerByName } from './customFunctions';

const map = $('#map').data('map');
const mapLayers = map.getLayers();

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.addOverlay(overlay);

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;

  const plotsLayer = getLayerByName('WFS');
  if (plotsLayer && plotsLayer.getVisible()) {
    const clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });

    if (clickedFeature) {
      const Survey_No = clickedFeature.get('plot_no');
      const Area = clickedFeature.get('area');
      const availibilty = clickedFeature.get('avail');

      function escHtml(s) {
        return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }

      const plotsinfo = $('#info');
      let popupHTML = `<h5>Plot Info:</h5><br>
        <style>
          h5 { font-size: 20px }
        </style>
        <p>Plot Number: ${escHtml(Survey_No)}</p>
        <p>Plot Area: ${escHtml(Area)} sqm</p><br>`;

      if (availibilty && availibilty.trim().toLowerCase() === 'available') {
        popupHTML += `<p>Status: <strong style="color:green;">Available</strong></p>`;
      } else {
        popupHTML += `<p>Status: <strong style="color:red;">Sold</strong></p>`;
      }

      plotsinfo.html(popupHTML);
      $('#no-feature').html('');
      overlay.setPosition(coordinate);
    }
  }
});
