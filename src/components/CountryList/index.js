import './style.scss';

const CountryList = (summaryObj) => {
  const countryList = document.createElement('div');
  countryList.className = 'country-list';

  const searchBlock = document.createElement('div');
  searchBlock.className = 'search__block';
  searchBlock.id = 'search__block';

  const searchBlockWrapper = document.createElement('div');
  searchBlockWrapper.className = 'search__block__wrapper';

  const searchInput = document.createElement('input');
  searchInput.className = 'search__input';
  searchInput.type = 'search';
  searchInput.placeholder = 'Search...';
  searchBlockWrapper.appendChild(searchInput);
  searchBlock.appendChild(searchBlockWrapper);

  const casesBlock = document.createElement('div');
  casesBlock.className = 'cases__block';

  const totalCasesBlock = document.createElement('div');
  totalCasesBlock.className = 'total__cases__block';

  if (!summaryObj) {
    countryList.innerText = 'Loading';
    return countryList;
  } else {
    countryList.appendChild(searchBlock);
    countryList.appendChild(casesBlock);
    countryList.appendChild(totalCasesBlock);
    casesForEachCountry(summaryObj.countries);
  }

  searchInput.onkeyup = function () {
    casesForEachCountry(summaryObj.countries);
  };
  function casesForEachCountry(countries) {
    casesBlock.innerHTML = '';
    for (const country of countries) {
      if (
        country.country.toLowerCase().includes(searchInput.value.toLowerCase())
      ) {
        casesBlock.innerHTML += `<div class='cases__for__country'>
        <div class='flag'><img src='${country.flag}'></div>
        <div class='country__name'>${country.country}</div>
        <div class='cases'>${country.cases}</div>
        </div>`;
      }
    }
  }

  return countryList;
};

export default CountryList;
