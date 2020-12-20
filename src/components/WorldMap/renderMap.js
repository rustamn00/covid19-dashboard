import L from 'leaflet';
import helpers from 'utils/helpers';

const colorPalette = [
  '#49006a',
  '#7a0177',
  '#ae017e',
  '#dd3497',
  '#f768a1',
  '#fa9fb5',
  '#fcc5c0',
  '#fde0dd',
  '#fff7f3',
];

const grades = [1000000, 500000, 400000, 250000, 50000, 20000, 3000, 1000, 0];

const getColor = (d) => {
  for (let i = 0; i < grades.length - 1; i += 1) {
    if (d > grades[i]) {
      return colorPalette[i];
    }
  }
  return colorPalette[colorPalette.length - 1];
};

const renderMap = (containerName, mapData) => {
  const map = L.map(containerName, {
    worldCopyJump: true,
  });
  map.setView([0, 0], 1);
  map.zoomControl.setPosition('bottomleft');

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}' +
      '?access_token={accessToken}',
    {
      maxZoom: 18,
      minZoom: 1,
      id: 'mapbox/streets-v11',
      zoomOffset: -1,
      accessToken: process.env.MAPBOX_TOKEN,
      tileSize: 512,
    },
  ).addTo(map);

  const style = (feature) => ({
    fillColor: getColor(feature.properties[mapData.status]),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  });

  const popup = L.popup();
  const displayPopup = (props) => {
    popup
      .setLatLng([props.lat, props.long])
      .setContent(
        `<h4>${props.country}</h4><h5><b>${helpers.capitalize(
          mapData.status,
        )}</b>:&nbsp;${helpers.addThousandsSeparator(
          props[mapData.status],
        )}</h5>`,
      )
      .openOn(map);
  };

  const highlightFeature = (e) => {
    const layer = e.target;

    layer.setStyle({
      weight: 1,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    displayPopup(layer.feature.properties);
  };

  let geojson;
  const resetHighlight = (e) => {
    geojson.resetStyle(e.target);
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  geojson = L.geoJSON(mapData, {
    style,
    onEachFeature,
  }).addTo(map);

  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-info legend');
    div.innerHTML += `<h4 class="center">${helpers.capitalize(
      mapData.status,
    )}</h4>`;

    for (let i = 0; i < grades.length; i += 1) {
      div.innerHTML += `<i style="background: ${getColor(
        grades[i] + 1,
      )}"></i>${helpers.addThousandsSeparator(grades[i])}${
        grades[i - 1]
          ? `&ndash;${helpers.addThousandsSeparator(grades[i - 1])}`
          : '+'
      }<br>`;
    }

    return div;
  };

  legend.addTo(map);
};

export default renderMap;
