import './style.scss';

const CountryList = (summaryForAllCountries) => {
  const countryList = document.createElement('div');
  countryList.className = 'country-list';

  countryList.innerText = 'Country List';
  console.log('summaryForAllCountries', summaryForAllCountries);

  return countryList;
};

export default CountryList;
