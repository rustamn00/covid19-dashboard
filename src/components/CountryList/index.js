import Select from '../common/Select';
import State from '../../utils/State';
import './style.scss';

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
  searchInput.type = 'search';
  searchInput.className = 'search__input';
  searchInput.placeholder = 'Search...';
  searchBlockWrapper.appendChild(searchInput);
  searchBlock.appendChild(searchBlockWrapper);
  const casesBlock = document.createElement('div');
  casesBlock.className = 'cases__block';
  casesBlock.id = 'cases__block';

  countryList.appendChild(Select.Period());
  countryList.appendChild(Select.Unit());
  countryList.appendChild(Select.Status());

  countryList.appendChild(searchBlock);
  countryList.appendChild(casesBlock);
  function casesForEachCountry(countries) {
    casesBlock.innerHTML = '';
    countries.forEach((country) => {
      searchInput.value = searchInput.value.toLowerCase();
      if (country.country.toLowerCase().includes(searchInput.value.trim())) {
        const row = document.createElement('div');
        row.className = 'cases__for__country';
        row.innerHTML = `
          <div class='flag'><img src='${country.flag}'></div>
          <div class='country__name'>${country.country}</div>
          <div class='cases'>${country[summaryObj.status]}</div>
        `;
        row.addEventListener('click', () => {
          console.log('aaaa');
          State.setRegion(country.country);
        });
        casesBlock.appendChild(row);
      }
    });
  }
  casesForEachCountry(summaryObj.countries);

  searchInput.onkeyup = () => {
    casesForEachCountry(summaryObj.countries);
  };
  return countryList;
};
export default CountryList;
