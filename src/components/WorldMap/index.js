import './style.scss';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const mapContainerName = 'map-container';
const renderMap = () => {
  const map = L.map(mapContainerName);
  map.setView([0, 0], 1);

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}' +
      '?access_token={accessToken}',
    {
      maxZoom: 18,
      minZoom: 1,
      id: 'mapbox/dark-v10',
      zoomOffset: -1,
      accessToken: process.env.MAPBOX_TOKEN,
      attribution: 'Map data &copy; OpenStreetMap',
      tileSize: 512,
    },
  ).addTo(map);
};

const WorldMap = (summaryForAllCountries) => {
  const worldMap = document.createElement('div');
  worldMap.className = 'world-map';

  worldMap.innerText = 'World Map';
  if (!summaryForAllCountries) {
    return worldMap;
  }

  const mapContainer = document.createElement('div');
  mapContainer.id = mapContainerName;
  mapContainer.className = mapContainerName;
  worldMap.appendChild(mapContainer);
  setTimeout(renderMap, 0);

  return worldMap;
};

export default WorldMap;
