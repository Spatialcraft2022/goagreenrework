import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';

const map = $('#map').data('map');
const isMobile = window.innerWidth <= 600;

// Build a proper GetLegendGraphic URL from a WMS source
function buildLegendUrl(baseUrl, layerName, isMobile) {
    const url = new URL(baseUrl.split('?')[0]);
    // Preserve the MAP param from the original URL
    const origParams = new URLSearchParams(baseUrl.split('?')[1] || '');
    if (origParams.get('MAP')) url.searchParams.set('MAP', origParams.get('MAP'));

    url.searchParams.set('SERVICE', 'WMS');
    url.searchParams.set('VERSION', '1.1.1');
    url.searchParams.set('REQUEST', 'GetLegendGraphic');
    url.searchParams.set('FORMAT', 'image/png');
    url.searchParams.set('LAYER', layerName);
    url.searchParams.set('TRANSPARENT', 'TRUE');
    url.searchParams.set('LAYERTITLE', 'FALSE');
    url.searchParams.set('RULELABEL', 'TRUE');
    url.searchParams.set('ITEMFONTBOLD', 'FALSE');
    url.searchParams.set('ITEMFONTSIZE', isMobile ? '18' : '22');
    url.searchParams.set('ITEMFONTITALIC', 'FALSE');
    url.searchParams.set('ITEMFONTCOLOR', '#ffffff');
    url.searchParams.set('SYMBOLWIDTH', isMobile ? '7' : '16');
    url.searchParams.set('SYMBOLHEIGHT', isMobile ? '2' : '10');
    url.searchParams.set('ICONLABELSPACE', '2');
    url.searchParams.set('SYMBOLSPACE', '4');
    return url.toString();
}

map.getLayers().getArray().forEach(layer => {
    const name = layer.get('name');
    if (!name) return;

    // Map layer uses a static legend image
    if (name === 'Map') {
        layer.set('graphic', './maplegend.png');
        return;
    }

    const source = layer.getSource();
    let baseUrl = null;
    let layerName = null;

    if (source instanceof TileWMS) {
        baseUrl = source.getUrls()?.[0];
        layerName = source.getParams().LAYERS;
    } else if (source instanceof ImageWMS) {
        baseUrl = source.getUrl();
        layerName = source.getParams().LAYERS;
    }

    if (baseUrl && layerName) {
        layer.set('graphic', buildLegendUrl(baseUrl, layerName, isMobile));
    }
});
