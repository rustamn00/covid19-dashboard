import Select from '../common/Select';
import renderChart from './renderChart';
import './style.scss';

const DailyChart = (dailyChartData) => {
  const dailyChart = document.createElement('div');
  dailyChart.className = 'daily-chart';

  if (!dailyChartData) {
    dailyChart.innerText = 'Loading ...';
    return dailyChart;
  }

  const controlPanel = document.createElement('control-panel');
  controlPanel.className = 'control-panel';
  [Select.Period, Select.Status, Select.Unit].forEach((select) => {
    controlPanel.appendChild(select());
  });
  dailyChart.appendChild(controlPanel);

  if (dailyChartData.isDataUnavailable) {
    const unavailableDataText = document.createElement('h4');
    unavailableDataText.innerText = 'Data is unavailable';
    dailyChart.appendChild(unavailableDataText);
  } else {
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
