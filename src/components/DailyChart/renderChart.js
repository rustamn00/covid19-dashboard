import Chart from 'chart.js';
import helpers from 'utils/helpers';

const renderChart = (chartContainerName, chartData) => {
  const lineChart = new Chart(chartContainerName, {
    type: 'line',
    data: {
      labels: chartData.figures.map((entry) => entry[0]),
      datasets: [
        {
          label: helpers.capitalize(chartData.status),
          data: chartData.figures.map((entry) => entry[1]),
          backgroundColor: '#75cff0',
          borderColor: '#49006a',
          borderWidth: 1,
          spanGaps: true,
          pointBackgroundColor: '#dd3497',
        },
      ],
    },
    options: {
      layout: {
        padding: {
          top: 20,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (value) => helpers.convertToShortNum(value),
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              parser: 'MM/DD/YYYY',
              unit: 'month',
              tooltipFormat: 'MMM DD, YYYY',
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            let labelStr = data.datasets[tooltipItem.datasetIndex].label || '';

            if (labelStr.length > 0) {
              labelStr += ': ';
            }
            labelStr += helpers.addThousandsSeparator(tooltipItem.yLabel);
            return labelStr;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  });

  return lineChart;
};

export default renderChart;
