import './styles/main.scss';
import { CountryList, InfoTable, WorldMap } from './components';

const rootNode = document.getElementById('root');

rootNode.appendChild(InfoTable());
rootNode.appendChild(CountryList());
rootNode.appendChild(WorldMap());
