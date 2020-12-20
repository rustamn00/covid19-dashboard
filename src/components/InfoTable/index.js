import './style.scss';

const InfoTable = (summaryForAllStatuses) => {
  const infoTable = document.createElement('div');
  infoTable.className = 'info-table';

  infoTable.innerText = 'Info Table';
  // console.log('summaryForAllStatuses', summaryForAllStatuses);

  return infoTable;
};

export default InfoTable;
