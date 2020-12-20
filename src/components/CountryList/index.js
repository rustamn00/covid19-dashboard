import './style.scss';

const CountryList = (summaryForAllCountries) => {
  const summaryObj = summaryForAllCountries;
  const countryList = document.createElement('div');
  countryList.className = 'country-list';

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

  const totalCasesBlock = document.createElement('div');
  totalCasesBlock.className = 'totalCases__block';
  totalCasesBlock.id = 'totalCases__block';

  countryList.appendChild(searchBlock);
  countryList.appendChild(casesBlock);
  countryList.appendChild(totalCasesBlock);

  if (!summaryObj) {
    countryList.innerText = 'Loading';
  } else {
    casesForEachCountry(summaryObj.countries);
  }

  searchInput.onkeyup = function () {
    casesForEachCountry(summaryObj.countries);
  };
  function casesForEachCountry(obj) {
    casesBlock.innerHTML = '';
    for (const country of obj) {
      if (
        country.country.toLowerCase().includes(searchInput.value.toLowerCase())
      ) {
        casesBlock.innerHTML += `<div class='cases__for__country'>
          <div class='cases'>${country.cases}</div>
          <div class='country__name'>${country.country}</div>
          <div class='flag'><img src='${country.flag}'></div>
        </div>`;
      }
    }
  }

  return countryList;
};

export default CountryList;
