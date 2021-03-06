import helpers from 'utils/helpers';
import { REGIONS, SELECT_TYPES } from 'utils/constants';
import ControlPanel from '../common/ControlPanel';
import countriesData from 'utils/countriesData.json';
import './style.scss';

const InfoTable = (summaryForAllStatuses) => {
  const dataObj = summaryForAllStatuses;
  const infoTable = document.createElement('div');
  infoTable.className = 'info-table';

  if (!dataObj) {
    infoTable.innerText = 'Loading';
    return infoTable;
  }

  const dataTableCases = document.createElement('span');
  dataTableCases.className = 'cases';
  const dataTableRecovered = document.createElement('span');
  dataTableRecovered.className = 'recovered';
  const dataTableDeaths = document.createElement('span');
  dataTableDeaths.className = 'deaths';

  dataTableCases.innerText = `Cases: ${helpers.addThousandsSeparator(
    dataObj.cases,
  )}`;
  dataTableRecovered.innerText = `Recovered: ${helpers.addThousandsSeparator(
    dataObj.recovered,
  )}`;
  dataTableDeaths.innerText = `Deaths: ${helpers.addThousandsSeparator(
    dataObj.deaths,
  )}`;

  const dataPanel = document.createElement('div');
  dataPanel.className = 'dataPanel';

  const regionText = document.createElement('h2');

  if (summaryForAllStatuses.region === REGIONS.ALL) {
    regionText.innerText = 'Global';
  } else {
    regionText.innerText = countriesData.find(
      (country) => country.iso2 === summaryForAllStatuses.region,
    ).country;
  }

  dataPanel.appendChild(regionText);
  dataPanel.appendChild(dataTableCases);
  dataPanel.appendChild(dataTableRecovered);
  dataPanel.appendChild(dataTableDeaths);

  const { PERIOD, UNIT } = SELECT_TYPES;
  infoTable.appendChild(ControlPanel(PERIOD, UNIT));
  infoTable.appendChild(dataPanel);

  return infoTable;
};

export default InfoTable;
