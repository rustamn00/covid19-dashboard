import './style.scss';
import 'leaflet/dist/leaflet.css';
import { PERIODS, STATUSES, UNITS } from 'utils/constants';
import helpers from 'utils/helpers';
import State from 'utils/State';
import renderMap from './renderMap';
import Select from './components/Select';

const WorldMap = (mapData) => {
  const worldMap = document.createElement('div');
  worldMap.className = 'world-map';

  worldMap.innerText = 'World Map';
  if (!mapData) {
    return worldMap;
  }

  const controlPanel = document.createElement('div');
  controlPanel.className = 'control-panel';
  worldMap.appendChild(controlPanel);

  [
    [
      STATUSES,
      mapData.status,
      (status) => helpers.capitalize(status),
      (status) => State.setStatus(status),
    ],
    [
      UNITS,
      mapData.unit,
      (unit) => (unit === UNITS.ABSOLUTE ? 'Total' : 'Per 100k pop'),
      (unit) => State.setUnit(unit),
    ],
    [
      PERIODS,
      mapData.period,
      (period) => helpers.capitalize(period.replace('_', ' ')),
      (period) => State.setPeriod(period),
    ],
  ].forEach(([valuesObj, defaultValue, titleHelper, onChange]) => {
    const selectData = Object.values(valuesObj).map((value) => ({
      title: titleHelper(value),
      value,
    }));
    const select = Select(selectData, defaultValue, onChange);
    controlPanel.appendChild(select);
  });

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
