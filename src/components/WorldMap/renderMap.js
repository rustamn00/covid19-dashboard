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

const roundFromRight = (num, places) => {
  const tenthExponent = 10 ** places;
  return Math.round(num / tenthExponent) * tenthExponent;
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

  const vals = mapData.features
    .sort((a, b) => a.properties[mapData.status] - b.properties[mapData.status])
    .map((feature) => feature.properties[mapData.status]);
  const [minVal, maxVal] = [vals[0], vals[vals.length - 1]];
  const gradeRange = maxVal - minVal + 1;
  const grades = [];
  if (gradeRange < 9) {
    for (let i = minVal; i <= maxVal; i += 1) {
      grades.push(minVal + i);
    }
  } else {
    const frequencyMap = vals.reduce(
      (acc, val) => ({
        ...acc,
        [val]: acc[val] ? acc[val] + 1 : 1,
      }),
      {},
    );

    let gradeIndex = 0;
    let cumulativeFrequency = 0;
    for (let i = minVal; i <= maxVal; i += 1) {
      if (
        cumulativeFrequency >=
        (gradeIndex * vals.length) / colorPalette.length
      ) {
        let gradeValue = i;
        const highestTenthPower = Math.floor(Math.log(maxVal) / Math.log(10));
        for (let j = highestTenthPower; j >= 1; j -= 1) {
          if (
            gradeValue > 10 ** j &&
            grades[grades.length - 1] !== roundFromRight(gradeValue, j)
          ) {
            gradeValue = roundFromRight(gradeValue, j);
            break;
          }
        }
        grades.push(gradeValue);
        gradeIndex += 1;
        if (gradeIndex === colorPalette.length) {
          break;
        }
      }
      if (frequencyMap[i]) {
        cumulativeFrequency += frequencyMap[i];
      }
    }
  }
  grades.reverse();

  const getColor = (d) => {
    for (let i = 0; i < grades.length; i += 1) {
      if (d + 0.5 > grades[i]) {
        const paletteOverflow = colorPalette.length - grades.length;
        if (paletteOverflow > 0) {
          return colorPalette[paletteOverflow + i];
        }
        return colorPalette[i];
      }
    }
    return colorPalette[colorPalette.length - 1];
  };

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
      const leftHandSide = helpers.convertToShortNum(grades[i]);

      let rightHandSide = '';
      if (grades.length === colorPalette.length) {
        if (grades[i - 1] != null) {
          rightHandSide += ` &ndash; <${helpers.convertToShortNum(
            grades[i - 1],
          )}`;
        } else {
          rightHandSide += ' +';
        }
      }

      div.innerHTML += `<i style="background: ${getColor(
        grades[i],
      )}"></i>${leftHandSide}${rightHandSide}<br>`;
    }

    return div;
  };

  legend.addTo(map);
};

export default renderMap;
