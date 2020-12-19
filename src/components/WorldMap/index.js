import './style.scss';

const WorldMap = (summaryForAllCountries) => {
  const worldMap = document.createElement('div');
  worldMap.className = 'world-map';

  worldMap.innerText = 'World Map';
  // console.log('summaryForAllCountries', summaryForAllCountries);

  return worldMap;
};

export default WorldMap;
