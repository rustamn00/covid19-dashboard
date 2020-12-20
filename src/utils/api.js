import State from './State';
import {
  STATUSES,
  REGIONS,
  PERIODS,
  UNITS,
  RELATIVE_POPULATION_COUNT,
} from './constants';
import helpers from './helpers';

const worldometersApiFetch = async (path, params) => {
  const url = new URL(`https://disease.sh/v3/covid-19/${path}`);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getStatusFieldNameByPeriod = (period) => (status) => {
  const lastDayPrefix = 'today';
  return period === PERIODS.ALL_TIME
    ? status
    : lastDayPrefix.concat(helpers.capitalize(status));
};

const getSummaryForAllStatuses = async () => {
  const region = State.getRegion();
  const url = region === REGIONS.ALL ? REGIONS.ALL : `countries/${region}`;
  const regionalData = await worldometersApiFetch(url, [{ yesterday: true }]);

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

const getCovidDataForAllCountries = async () => {
  const countriesData = await worldometersApiFetch('countries', [
    { yesterday: true },
  ]);

  const period = State.getPeriod();
  const status = State.getStatus();
  const fieldName = getStatusFieldNameByPeriod(period)(status);
  let extractedCountriesData = countriesData
    .filter(({ population }) => population > 0)
    .map((countryObj) => ({
      country: countryObj.country,
      flag: countryObj.countryInfo.flag,
      iso2: countryObj.countryInfo.iso2,
      lat: countryObj.countryInfo.lat,
      long: countryObj.countryInfo.long,
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

  return {
    status,
    unit,
    period,
    countries: extractedCountriesData,
  };
};

const getSummaryForAllCountries = async () => {
  const covidDataForAllCountries = await getCovidDataForAllCountries();
  const status = State.getStatus();
  const sortedByStatusFieldDesc = [...covidDataForAllCountries.countries].sort(
    (a, b) => b[status] - a[status],
  );

  return {
    ...covidDataForAllCountries,
    countries: sortedByStatusFieldDesc,
  };
};

const getGeoData = async () => {
  const response = await fetch('assets/data/countries.geojson', {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  const data = await response.json();
  return data;
};

const getMapData = async () => {
  const geoData = await getGeoData();
  const { countries, ...metadata } = await getCovidDataForAllCountries();
  const featuresForAvailableCountries = [];
  for (let i = 0; i < geoData.features.length; i += 1) {
    const currentFeature = geoData.features[i];
    const matchingCountry = countries.find(
      (country) => country.iso2 === currentFeature.properties.ISO_A2,
    );
    if (matchingCountry) {
      currentFeature.properties = {
        ...matchingCountry,
      };
      featuresForAvailableCountries.push(currentFeature);
    }
  }
  return {
    ...geoData,
    ...metadata,
    features: featuresForAvailableCountries,
  };
};

export default {
  getSummaryForAllStatuses,
  getSummaryForAllCountries,
  getMapData,
};
