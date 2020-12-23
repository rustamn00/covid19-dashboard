import { REGIONS, SELECT_TYPES } from 'utils/constants';
import countriesData from 'utils/countriesData.json';
import ControlPanel from '../common/ControlPanel';
import renderChart from './renderChart';
import './style.scss';

const DailyChart = (dailyChartData) => {
  const dailyChart = document.createElement('div');
  dailyChart.className = 'daily-chart';

  if (!dailyChartData) {
    dailyChart.innerText = 'Loading ...';
    return dailyChart;
  }

  const { PERIOD, STATUS, UNIT } = SELECT_TYPES;
  dailyChart.appendChild(ControlPanel(PERIOD, STATUS, UNIT));

  if (dailyChartData.isDataUnavailable) {
    const unavailableDataText = document.createElement('h4');
    unavailableDataText.innerText = 'Data is unavailable';
    dailyChart.appendChild(unavailableDataText);
  } else {
    const regionText = document.createElement('h2');
    if (dailyChartData.region === REGIONS.ALL) {
      regionText.innerText = 'Global';
    } else {
      regionText.innerText = countriesData.find(
        (country) => country.iso2 === dailyChartData.region,
      ).country;
    }
    dailyChart.appendChild(regionText);

    const chartContainerName = 'chart-container';
    const chartContainer = document.createElement('canvas');
    chartContainer.id = chartContainerName;
    chartContainer.className = chartContainerName;
    dailyChart.appendChild(chartContainer);
    setTimeout(() => {
      renderChart(chartContainerName, dailyChartData);
    }, 0);
  }

  return dailyChart;
};

export default DailyChart;
