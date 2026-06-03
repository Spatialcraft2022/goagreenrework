import { getLayerByName } from './customFunctions';

const map = $('#map').data('map');
const layers = map.getLayers();
const closer = $('#draggable-closer');

$(document).ready(function () {
    const layerDivContent = $('#draggable-content');
    layerDivContent.html('');

    // Plot Boundary first, then other WMS layers (skip basemaps)
    const skipNames = ['OSM', 'Google Satellite', 'WFS'];

    layers.forEach(layer => {
        if (layer.get('name') === 'Plot Boundary') addLayerCheckbox(layer, layerDivContent);
    });

    layers.forEach(layer => {
        const name = layer.get('name');
        if (name && !skipNames.includes(name) && name !== 'Plot Boundary') {
            addLayerCheckbox(layer, layerDivContent);
        }
    });

    // Checkbox toggle
    $(document).on('change', '.form-check-input', function () {
        const id = $(this).attr('id');
        map.getLayers().getArray().forEach(layer => {
            if (layer.get('name') && layer.get('name').replace(/[.\s]+/g, '_') === id) {
                layer.setVisible(this.checked);
            }
        });
    });

    $('#closer').click(() => $('#draggable').css('display', 'none'));
    $('#layers').click(() => $('#draggable').css('display', 'block'));
});

function addLayerCheckbox(layer, container) {
    const name = layer.get('name');
    if (!name) return;
    const id = name.replace(/[.\s]+/g, '_');
    const legendUrl = layer.get('graphic') || '';
    const iconClass = name === 'Map' ? 'map-icon' : 'legend-icon';

    const el = `
        <div class="form-check">
            <input type="checkbox" class="form-check-input" id="${id}">
            <label class="form-check-label" for="${id}">
                ${legendUrl ? `<img src="${legendUrl}" alt="${name}" class="${iconClass}">` : ''}
                ${name}
            </label>
        </div>`;

    container.append(el);
    $(`#${id}`).prop('checked', layer.getVisible());
}
