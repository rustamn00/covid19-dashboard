import State from './State';
import { STATUSES, REGIONS } from './constants';

const covidApiFetch = async (path) => {
  const COVID_API_HOST = 'https://api.covid19api.com';
  const response = await fetch(`${COVID_API_HOST}${path}`);
  const data = await response.json();
  return data;
};

const getSummaryForAllStatuses = async () => {
  const data = await covidApiFetch('/summary');
  const region = State.getRegion();
  const regionalData = data[region];
  const period = State.getPeriod();
  const unit = State.getUnit();
  return {
    Region: region,
    Unit: unit,
    Period: period,
    [STATUSES.CONFIRMED]: regionalData[`${period}${STATUSES.CONFIRMED}`],
    [STATUSES.DEATHS]: regionalData[`${period}${STATUSES.DEATHS}`],
    [STATUSES.RECOVERED]: regionalData[`${period}${STATUSES.RECOVERED}`],
  };
};

const getSummaryForAllCountries = async () => {
  const data = await covidApiFetch('/summary');
  const rawCountriesData = data[REGIONS.COUNTRIES];
  const period = State.getPeriod();
  const status = State.getStatus();
  const extractedCountriesData = rawCountriesData.map((countryObj) => ({
    Country: countryObj.Country,
    Slug: countryObj.Slug,
    [status]: countryObj[`${period}${status}`],
  }));
  const sortedByStatusFieldDesc = [...extractedCountriesData].sort(
    (a, b) => b[status] - a[status],
  );
  const unit = State.getUnit();
  return {
    Status: status,
    Unit: unit,
    Period: period,
    Countries: sortedByStatusFieldDesc,
  };
};

export default {
  getSummaryForAllStatuses,
  getSummaryForAllCountries,
};
