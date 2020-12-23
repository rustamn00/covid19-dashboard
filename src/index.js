import State from 'utils/State';
import api from 'utils/api';
import './styles/main.scss';
import './style.scss';
import {
  CountryList,
  InfoTable,
  WorldMap,
  DailyChart,
  Footer,
} from './components';

State.init();
const {
  subscribeToPeriod,
  subscribeToRegion,
  subscribeToStatus,
  subscribeToUnit,
} = State;

const rootNode = document.getElementById('root');
const mainBlock = document.createElement('div');
const rightSection = document.createElement('div');
mainBlock.className = 'main-block';
rightSection.className = 'right-section';

const BlockContainer = (childComponent) => {
  const blockContainer = document.createElement('div');
  const xButton = document.createElement('button');
  xButton.innerHTML = '&hArr;';
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
mainBlock.appendChild(countryList);
const updateCountryList = async () => {
  const summaryForAllCountries = await api.getSummaryForAllCountries();
  const newCountryList = BlockContainer(CountryList(summaryForAllCountries));
  mainBlock.replaceChild(newCountryList, countryList);
  countryList = newCountryList;
};
[subscribeToPeriod, subscribeToStatus, subscribeToUnit].forEach((subscribe) => {
  subscribe.call(State, updateCountryList);
});
(async () => {
  await updateCountryList();
})();

let worldMap = BlockContainer(WorldMap());
mainBlock.appendChild(worldMap);
const updateWorldMap = async () => {
  const mapData = await api.getMapData();
  const newWorldMap = BlockContainer(WorldMap(mapData));
  mainBlock.replaceChild(newWorldMap, worldMap);
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
mainBlock.appendChild(rightSection);
rootNode.appendChild(mainBlock);
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

const footer = Footer();
// footer.classList.add('block-container');
rootNode.appendChild(footer);

setTimeout(() => {
  const xButtons = document.querySelectorAll('.x-button');
  const blockContainerDivs = document.querySelectorAll('.block-container');
  xButtons.forEach((item) => {
    item.addEventListener('click', () => {
      const className = item.classList[0];
      blockContainerDivs.forEach((div) => {
        if (className.split('-')[0] !== div.classList[1].split('-')[0]) {
          if (
            className.split('-')[0] === 'world' ||
            className.split('-')[0] === 'country'
          ) {
            rightSection.classList.toggle('display-none');
          }
          footer.classList.toggle('display-none');
          div.classList.toggle('display-none');
        } else {
          div.classList.toggle('size-100');
          if (div.parentElement.classList.contains('right-section')) {
            rightSection.classList.toggle('size-100');
          }
          const buttonRef = item;
          buttonRef.innerHTML = div.classList.contains('size-100')
            ? '&nhArr;'
            : '&hArr;';
        }
      });
    });
  });
}, 3000);
