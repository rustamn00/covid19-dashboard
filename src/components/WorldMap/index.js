import { SELECT_TYPES } from 'utils/constants';
import ControlPanel from '../common/ControlPanel';
import './style.scss';
import 'leaflet/dist/leaflet.css';
import renderMap from './renderMap';

const WorldMap = (mapData) => {
  const worldMap = document.createElement('div');
  worldMap.className = 'world-map';

  if (!mapData) {
    worldMap.innerText = 'Loading...';
    return worldMap;
  }

  const { PERIOD, STATUS, UNIT } = SELECT_TYPES;
  worldMap.appendChild(ControlPanel(PERIOD, STATUS, UNIT));

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
