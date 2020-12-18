import './style.scss';
import 'leaflet/dist/leaflet.css';
import renderMap from './renderMap';

const WorldMap = (mapData) => {
  const worldMap = document.createElement('div');
  worldMap.className = 'world-map';

  worldMap.innerText = 'World Map';
  if (!mapData) {
    return worldMap;
  }

  const mapContainerName = 'map-container';
  const mapContainer = document.createElement('div');
  mapContainer.id = mapContainerName;
  mapContainer.className = mapContainerName;
  worldMap.appendChild(mapContainer);
  setTimeout(() => {
    renderMap(mapContainerName, mapData);
  }, 0);

  return worldMap;
};

export default WorldMap;
