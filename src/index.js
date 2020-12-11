import State from 'utils/State';
import './styles/main.scss';
import { CountryList, InfoTable, WorldMap } from './components';

State.init();
const rootNode = document.getElementById('root');

rootNode.appendChild(InfoTable());
rootNode.appendChild(CountryList());
rootNode.appendChild(WorldMap());
