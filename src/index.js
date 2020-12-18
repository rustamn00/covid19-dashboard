import State from 'utils/State';
import api from 'utils/api';
import './styles/main.scss';
import { CountryList, InfoTable, WorldMap } from './components';

State.init();
const {
  subscribeToPeriod,
  subscribeToRegion,
  subscribeToStatus,
  subscribeToUnit,
} = State;

const rootNode = document.getElementById('root');

let infoTable = InfoTable();
rootNode.appendChild(infoTable);
const updateInfoTable = async () => {
  const summaryForAllStatuses = await api.getSummaryForAllStatuses();
  const newInfoTable = InfoTable(summaryForAllStatuses);
  rootNode.replaceChild(newInfoTable, infoTable);
  infoTable = newInfoTable;
};
[subscribeToPeriod, subscribeToRegion, subscribeToUnit].forEach((subscribe) => {
  subscribe.call(State, updateInfoTable);
});
(async () => {
  await updateInfoTable();
})();

let countryList = CountryList();
rootNode.appendChild(countryList);
const updateCountryList = async () => {
  const summaryForAllCountries = await api.getSummaryForAllCountries();
  const newCountryList = CountryList(summaryForAllCountries);
  rootNode.replaceChild(newCountryList, countryList);
  countryList = newCountryList;
};
[subscribeToPeriod, subscribeToStatus, subscribeToUnit].forEach((subscribe) => {
  subscribe.call(State, updateCountryList);
});
(async () => {
  await updateCountryList();
})();

let worldMap = WorldMap();
rootNode.appendChild(worldMap);
const updateWorldMap = async () => {
  const mapData = await api.getMapData();
  const newWorldMap = WorldMap(mapData);
  rootNode.replaceChild(newWorldMap, worldMap);
  worldMap = newWorldMap;
};
[
  subscribeToPeriod,
  subscribeToRegion,
  subscribeToStatus,
  subscribeToUnit,
].forEach((subscribe) => {
  subscribe.call(State, updateWorldMap);
});
(async () => {
  await updateWorldMap();
})();
