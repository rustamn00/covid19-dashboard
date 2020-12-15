import State from './State';
import {
  STATUSES,
  REGIONS,
  PERIODS,
  UNITS,
  RELATIVE_POPULATION_COUNT,
} from './constants';

const capitalize = (str) => str.slice(0, 1).toUpperCase().concat(str.slice(1));

const worldometersApiFetch = async (path) => {
  const url = new URL(`https://disease.sh/v3/covid-19/${path}`);
  url.searchParams.append('yesterday', 'true');
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getStatusFieldNameByPeriod = (period) => (status) => {
  const lastDayPrefix = 'today';
  return period === PERIODS.ALL_TIME
    ? status
    : lastDayPrefix.concat(capitalize(status));
};

const getSummaryForAllStatuses = async () => {
  const region = State.getRegion();
  const url = region === REGIONS.ALL ? REGIONS.ALL : `countries/${region}`;
  const regionalData = await worldometersApiFetch(url);

  const period = State.getPeriod();
  const getStatusFieldName = getStatusFieldNameByPeriod(period);
  const statusCountsObj = Object.values(STATUSES).reduce(
    (result, status) => ({
      ...result,
      [status]: regionalData[getStatusFieldName(status)],
    }),
    {},
  );

  const unit = State.getUnit();
  if (unit === UNITS.RELATIVE) {
    const { population } = regionalData;
    Object.keys(statusCountsObj).forEach((key) => {
      statusCountsObj[key] = Math.round(
        (statusCountsObj[key] * RELATIVE_POPULATION_COUNT) / population,
      );
    });
  }

  return {
    region,
    unit,
    period,
    ...statusCountsObj,
  };
};

const getSummaryForAllCountries = async () => {
  const countriesData = await worldometersApiFetch('countries');

  const period = State.getPeriod();
  const status = State.getStatus();
  const fieldName = getStatusFieldNameByPeriod(period)(status);
  let extractedCountriesData = countriesData
    .filter(({ population }) => population > 0)
    .map((countryObj) => ({
      country: countryObj.country,
      flag: countryObj.countryInfo.flag,
      population: countryObj.population,
      [status]: countryObj[fieldName],
    }));

  const unit = State.getUnit();
  if (unit === UNITS.RELATIVE) {
    extractedCountriesData = extractedCountriesData.map((countryObj) => ({
      ...countryObj,
      [status]: Math.round(
        (countryObj[status] * RELATIVE_POPULATION_COUNT) /
          countryObj.population,
      ),
    }));
  }

  const sortedByStatusFieldDesc = [...extractedCountriesData].sort(
    (a, b) => b[status] - a[status],
  );

  return {
    status,
    unit,
    period,
    countries: sortedByStatusFieldDesc,
  };
};

export default {
  getSummaryForAllStatuses,
  getSummaryForAllCountries,
};
