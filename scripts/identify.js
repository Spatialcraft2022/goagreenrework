import 'ol/ol.css';
import Overlay from 'ol/Overlay.js';
import { getLayerByName } from './customFunctions';

const map = $('#map').data('map');

const container = document.getElementById('popup');
const closer = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: container,
  autoPan: { animation: { duration: 250 } },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.addOverlay(overlay);

function escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const plotsLayer = getLayerByName('Plot Boundary');

  if (!plotsLayer || !plotsLayer.getVisible()) return;

  const view = map.getView();
  const url = plotsLayer.getSource().getFeatureInfoUrl(
    coordinate,
    view.getResolution(),
    view.getProjection(),
    { INFO_FORMAT: 'application/json', FEATURE_COUNT: 1 }
  );

  if (!url) return;

  fetch(url)
    .then(r => r.json())
    .then(data => {
      if (!data.features || data.features.length === 0) {
        overlay.setPosition(undefined);
        return;
      }

      const props = data.features[0].properties;
      const Survey_No = props.plot_no;
      const Area = props.area;
      const availibilty = props.avail;

      let popupHTML = `<h5>Plot Info:</h5><br>
        <style>h5 { font-size: 20px }</style>
        <p>Plot Number: ${escHtml(Survey_No)}</p>
        <p>Plot Area: ${escHtml(Area)} sqm</p><br>`;

      if (availibilty && availibilty.trim().toLowerCase() === 'available') {
        popupHTML += `<p>Status: <strong style="color:green;">Available</strong></p>`;
      } else {
        popupHTML += `<p>Status: <strong style="color:red;">Sold</strong></p>`;
      }

      $('#info').html(popupHTML);
      $('#no-feature').html('');
      overlay.setPosition(coordinate);
    })
    .catch(() => {
      overlay.setPosition(undefined);
    });
});
