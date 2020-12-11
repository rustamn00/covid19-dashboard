import './style.scss';

const WorldMap = () => {
  const worldMap = document.createElement('div');
  worldMap.className = 'world-map';

  worldMap.innerText = 'World Map';

  return worldMap;
};

export default WorldMap;
