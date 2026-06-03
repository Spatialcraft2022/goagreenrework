  import 'ol/ol.css';
  import TileLayer from 'ol/layer/Tile';
  import ImageLayer from 'ol/layer/Image';
  import TileWMS from 'ol/source/TileWMS';
  import ImageWMS from 'ol/source/ImageWMS';

  // Get your map reference
  const map = $('#map').data('map');

  // Function to clean and append legend parameters
  const cleanUrl = (url, params, isMobile) => {
    const urlObj = new URL(url);
    const allowedParams = [
      'MAP', 'VERSION', 'SERVICE', 'REQUEST', 'FORMAT', 'LAYERS', 'LAYER',
      'LAYERTITLE', 'RULELABEL', 'ITEMFONTBOLD', 'ITEMFONTSIZE', 'ITEMFONTITALIC',
      'ITEMFONTCOLOR', 'SYMBOLWIDTH', 'SYMBOLHEIGHT', 'ICONLABELSPACE', 'SYMBOLSPACE', 'TRANSPARENT'
    ];

    urlObj.pathname = decodeURIComponent(urlObj.pathname);

    // Remove extra params
    [...urlObj.searchParams].forEach(([key]) => {
      if (!allowedParams.includes(key)) {
        urlObj.searchParams.delete(key);
      }
    });

    // Add legend display parameters
  const filterParams = {
    LAYERTITLE: 'FALSE',
    RULELABEL: 'TRUE',
    ITEMFONTBOLD: 'FALSE',
    ITEMFONTSIZE: '22',
    ITEMFONTITALIC: 'FALSE',
    ITEMFONTCOLOR: '#ffffff',  // ✅ Now valid
    SYMBOLWIDTH: isMobile ? '7' : '16',
    SYMBOLHEIGHT: isMobile ? '2' : '10',
    ICONLABELSPACE: '2',
    SYMBOLSPACE: '4',
    TRANSPARENT: 'TRUE'
  };


    for (const param in filterParams) {
      if (!urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, filterParams[param]);
      }
    }

    return urlObj.toString();
  };

  // Extract WMS legend data
  const extractLayerData = (layer, isMobile) => {
    const source = layer.getSource();

    if (source instanceof TileWMS) {
      const url = source.getUrls();
      const params = source.getParams();
      const cleanedUrl = url ? cleanUrl(url[0], params, isMobile) : "Unknown";
      return {
        url: cleanedUrl,
        layerName: params.LAYERS || "Unknown"
      };
    } else if (source instanceof ImageWMS) {
      const url = source.getUrl();
      const params = source.getParams();
      const cleanedUrl = url ? cleanUrl(url, params, isMobile) : "Unknown";
      return {
        url: cleanedUrl,
        layerName: params.LAYERS || "Unknown"
      };
    }

    return null;
  };

  // Detect mobile screen
  const isMobile = window.innerWidth <= 600;

  // Assign updated graphic URLs to all layers
  map.getLayers().getArray().forEach(layer => {
    const layerName = layer.get('name');

    if (layerName === 'Map') {
      layer.set('graphic', './maplegend.png'); // Your local fallback
    } else {
      const layerData = extractLayerData(layer, isMobile);
      if (layerData) {
        layer.set('graphic', layerData.url);
      }
    }
  });

  // Optional: log result to console for verification
  const layersData = map.getLayers().getArray().map(layer => ({
    layerName: layer.get('name'),
    graphic: layer.get('graphic') || "No graphic attached"
  }));

  console.log(layersData);
