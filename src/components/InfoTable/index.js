import './style.scss';
import Select from '../common/Select';

const InfoTable = (summaryForAllStatuses) => {
  const dataObj = summaryForAllStatuses;
  const infoTable = document.createElement('div');
  infoTable.className = 'info-table';
  
  if (!dataObj) {
    infoTable.innerText = 'Loading';
    return infoTable;
  }
  infoTable.innerText = '';

  const dataTableCases = document.createElement('span');
  dataTableCases.className = 'cases';
  const dataTableRecovered = document.createElement('span');
  dataTableRecovered.className = 'recovered';
  const dataTableDeaths = document.createElement('span');
  dataTableDeaths.className = 'deaths';

  
  dataTableCases.innerText = `Global cases: ${dataObj.cases}`;
  dataTableRecovered.innerText = `Global recovered: ${dataObj.recovered}`;
  dataTableDeaths.innerText = `Global deaths: ${dataObj.deaths}`;
  

  const optionPanel = document.createElement('div');
  optionPanel.className = 'optionsPanel';

  optionPanel.appendChild(Select.Period());
  optionPanel.appendChild(Select.Unit());

  const dataPanel = document.createElement('div');
  dataPanel.className = 'dataPanel';

  
  dataPanel.appendChild(dataTableCases);
  dataPanel.appendChild(dataTableRecovered);
  dataPanel.appendChild(dataTableDeaths);

  infoTable.appendChild(optionPanel);
  infoTable.appendChild(dataPanel);

  return infoTable;
};

export default InfoTable;