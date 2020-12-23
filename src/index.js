import State from 'utils/State';
import api from 'utils/api';
import './styles/main.scss';
import './style.scss';
import { CountryList, InfoTable, WorldMap, DailyChart } from './components';

State.init();
const {
  subscribeToPeriod,
  subscribeToRegion,
  subscribeToStatus,
  subscribeToUnit,
} = State;

const rootNode = document.getElementById('root');
const rightSection = document.createElement('div');
rightSection.className = 'right-section';

const BlockContainer = (childComponent) => {
  const blockContainer = document.createElement('div');
  const xButton = document.createElement('button');
  xButton.innerText = 'X';
  xButton.className = `${childComponent.className}-button`;
  xButton.classList.add('x-button');
  blockContainer.className = 'block-container';
  blockContainer.classList.add(`${childComponent.className}-container`);
  blockContainer.appendChild(childComponent);
  blockContainer.appendChild(xButton);
  return blockContainer;
};
let infoTable = BlockContainer(InfoTable());
rightSection.appendChild(infoTable);
const updateInfoTable = async () => {
  const summaryForAllStatuses = await api.getSummaryForAllStatuses();
  const newInfoTable = BlockContainer(InfoTable(summaryForAllStatuses));
  rightSection.replaceChild(newInfoTable, infoTable);
  infoTable = newInfoTable;
};
[subscribeToPeriod, subscribeToRegion, subscribeToUnit].forEach((subscribe) => {
  subscribe.call(State, updateInfoTable);
});
(async () => {
  await updateInfoTable();
})();

let countryList = BlockContainer(CountryList());
rootNode.appendChild(countryList);
const updateCountryList = async () => {
  const summaryForAllCountries = await api.getSummaryForAllCountries();
  const newCountryList = BlockContainer(CountryList(summaryForAllCountries));
  rootNode.replaceChild(newCountryList, countryList);
  countryList = newCountryList;
};
[subscribeToPeriod, subscribeToStatus, subscribeToUnit].forEach((subscribe) => {
  subscribe.call(State, updateCountryList);
});
(async () => {
  await updateCountryList();
})();

let worldMap = BlockContainer(WorldMap());
rootNode.appendChild(worldMap);
const updateWorldMap = async () => {
  const mapData = await api.getMapData();
  const newWorldMap = BlockContainer(WorldMap(mapData));
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

let chart = BlockContainer(DailyChart());
rightSection.appendChild(chart);
rootNode.appendChild(rightSection);
const updateDailyChart = async () => {
  const chartData = await api.getDailyChartData();
  const newDailyChart = BlockContainer(DailyChart(chartData));
  rightSection.replaceChild(newDailyChart, chart);
  chart = newDailyChart;
};
[
  subscribeToPeriod,
  subscribeToRegion,
  subscribeToStatus,
  subscribeToUnit,
].forEach((subscribe) => {
  subscribe.call(State, updateDailyChart);
});
(async () => {
  await updateDailyChart();
})();
