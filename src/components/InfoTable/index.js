import './style.scss';

const InfoTable = () => {
  const infoTable = document.createElement('div');
  infoTable.className = 'info-table';

  infoTable.innerText = 'Info Table';

  return infoTable;
};

export default InfoTable;
