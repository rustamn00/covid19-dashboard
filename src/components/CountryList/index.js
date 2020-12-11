import './style.scss';

const CountryList = () => {
  const countryList = document.createElement('div');
  countryList.className = 'country-list';

  countryList.innerText = 'Country List';

  return countryList;
};

export default CountryList;
