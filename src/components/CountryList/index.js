import { SELECT_TYPES } from 'utils/constants';
import ControlPanel from '../common/ControlPanel';
import State from '../../utils/State';
import helpers from '../../utils/helpers';
import './style.scss';
import Keyboard from './components/Keyboard';

const CountryList = (summaryObj) => {
  const countryList = document.createElement('div');
  countryList.className = 'country-list';

  if (!summaryObj) {
    countryList.innerText = 'Loading';
    return countryList;
  }
  const searchBlock = document.createElement('div');
  searchBlock.className = 'search__block';
  searchBlock.id = 'search__block';

  const searchBlockWrapper = document.createElement('div');
  searchBlockWrapper.className = 'search__block__wrapper';

  const searchInput = document.createElement('input');
  searchInput.id = 'search__input';
  searchInput.type = 'text';
  searchInput.className = 'search__input';
  searchInput.placeholder = 'Search...';
  searchBlockWrapper.appendChild(searchInput);
  searchBlock.appendChild(searchBlockWrapper);
  const casesBlock = document.createElement('div');
  casesBlock.className = 'cases__block';
  casesBlock.id = 'cases__block';

  const { PERIOD, STATUS, UNIT } = SELECT_TYPES;
  countryList.appendChild(ControlPanel(PERIOD, STATUS, UNIT));

  countryList.appendChild(searchBlock);
  countryList.appendChild(casesBlock);
  const casesForEachCountry = (countries, searchValue = '') => {
    casesBlock.innerHTML = '';
    countries.forEach((country) => {
      if (
        country.country.toLowerCase().includes(searchValue.toLowerCase().trim())
      ) {
        const row = document.createElement('div');
        row.className = 'cases__for__country';
        row.innerHTML = `
          <div class='flag'><img src='${country.flag}'></div>
          <div class='country__name'>${country.country}</div>
          <div class='cases'>${helpers.addThousandsSeparator(
            country[summaryObj.status],
          )}</div>
        `;
        row.addEventListener('click', () => {
          State.setRegion(country.iso2);
        });
        casesBlock.appendChild(row);
      }
    });
  };
  casesForEachCountry(summaryObj.countries);

  setTimeout(
    () => Keyboard.init(casesForEachCountry.bind(null, summaryObj.countries)),
    0,
  );

  return countryList;
};

export default CountryList;
