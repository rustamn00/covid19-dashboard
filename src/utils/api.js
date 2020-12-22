import State from './State';
import {
  REGIONS,
  PERIODS,
  UNITS,
  RELATIVE_POPULATION_COUNT,
  WORLD_POPULATION_COUNT,
  STATUSES,
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
    const population =
      region === REGIONS.ALL
        ? WORLD_POPULATION_COUNT
        : countriesData.find((country) => country.iso2 === region).population;
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

const getDailyChartData = async () => {
  const region = State.getRegion();
  const regionalData = await hopkinsApiFetch(region, 31);
  const timeline =
    region === REGIONS.ALL ? regionalData : regionalData.timeline;
  const status = State.getStatus();
  const statusObj = timeline[status];
  let sortedByDate = Object.entries(statusObj).sort(
    (a, b) => new Date(a[0]) - new Date(b[0]),
  );

  // start: adjusting data anomalies
  let isDataUnavailable = false;
  if (region === 'US' && status === STATUSES.RECOVERED) {
    isDataUnavailable = true;
  }
  if (region === REGIONS.ALL && status === STATUSES.RECOVERED) {
    sortedByDate = sortedByDate.map(([key, val]) => {
      if (new Date(key) > new Date('12/13/2020')) {
        return [key, val + 10 ** 7];
      }
      return [key, val];
    });
  }
  // end: adjusting data anomalies

  const period = State.getPeriod();
  let adjustedByPeriod = [];
  if (period === PERIODS.ALL_TIME) {
    adjustedByPeriod.push(...sortedByDate.slice(1));
  } else {
    for (let i = sortedByDate.length - 1; i > 0; i -= 1) {
      adjustedByPeriod.unshift([
        sortedByDate[i][0],
        sortedByDate[i][1] - sortedByDate[i - 1][1],
      ]);
    }
  }

  const unit = State.getUnit();
  if (unit === UNITS.RELATIVE) {
    const population =
      region === REGIONS.ALL
        ? WORLD_POPULATION_COUNT
        : countriesData.find((country) => country.iso2 === region).population;
    adjustedByPeriod = adjustedByPeriod.map(([key, value]) => [
      key,
      Math.round((RELATIVE_POPULATION_COUNT * value) / population),
    ]);
  }

  return {
    isDataUnavailable,
    period,
    region,
    status,
    unit,
    figures: adjustedByPeriod,
  };
};

export default {
  getSummaryForAllStatuses,
  getSummaryForAllCountries,
  getMapData,
  getDailyChartData,
};
