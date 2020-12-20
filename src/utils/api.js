import State from './State';
import {
  REGIONS,
  PERIODS,
  UNITS,
  RELATIVE_POPULATION_COUNT,
} from './constants';
import countriesData from './countriesData.json';

const countryCodesString = countriesData
  .map((country) => country.iso2)
  .join(',');

const hopkinsApiFetch = async (path, lastdays) => {
  const url = new URL(`https://disease.sh/v3/covid-19/historical/${path}`);
  url.searchParams.append('lastdays', String(lastdays));
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getStatusCount = (statusObj) => {
  const period = State.getPeriod();
  const lastTwoDates = Object.keys(statusObj)
    .sort((a, b) => new Date(b) - new Date(a))
    .slice(0, 2);
  return period === PERIODS.ALL_TIME
    ? statusObj[lastTwoDates[0]]
    : statusObj[lastTwoDates[0]] - statusObj[lastTwoDates[1]];
};

const getSummaryForAllStatuses = async () => {
  const region = State.getRegion();
  const period = State.getPeriod();
  const regionalData = await hopkinsApiFetch(
    region,
    period === PERIODS.ALL_TIME ? 1 : 2,
  );

  const timeline =
    region === REGIONS.ALL ? regionalData : regionalData.timeline;

  const statusCountsObj = Object.entries(timeline).reduce(
    (acc, [statusKey, statusObj]) => {
      acc[statusKey] = getStatusCount(statusObj);
      return acc;
    },
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
  const period = State.getPeriod();
  const status = State.getStatus();
  const covidData = await hopkinsApiFetch(
    countryCodesString,
    period === PERIODS.ALL_TIME ? 1 : 2,
  );
  let extractedCountriesData = countriesData.map((country, i) => {
    const statusCount = getStatusCount(covidData[i].timeline[status]);
    return {
      ...country,
      [status]: statusCount,
    };
  });

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
