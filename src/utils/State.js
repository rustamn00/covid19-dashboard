import { PERIODS, UNITS, REGIONS, STATUSES } from './constants';
import countriesData from './countriesData.json';

const countryNames = countriesData.map(({ country }) => country);

const State = {
  init() {
    this.region = REGIONS.ALL;
    this.period = PERIODS.ALL_TIME;
    this.unit = UNITS.ABSOLUTE;
    this.status = STATUSES.CASES;
    this.regionListeners = [];
    this.periodListeners = [];
    this.unitListeners = [];
    this.statusListeners = [];
  },
  setUnit(unit) {
    if (!Object.values(UNITS).includes(unit)) {
      throw new Error(`Invalid argument for unit: '${unit}'`);
    }
    this.unit = unit;
    this.unitListeners.forEach((unitListener) => unitListener());
  },
  getUnit() {
    return this.unit;
  },
  subscribeToUnit(unitListener) {
    this.unitListeners = this.unitListeners.concat(unitListener);
  },
  setPeriod(period) {
    if (!Object.values(PERIODS).includes(period)) {
      throw new Error(`Invalid argument for period: '${period}'`);
    }
    this.period = period;
    this.periodListeners.forEach((periodListener) => periodListener());
  },
  getPeriod() {
    return this.period;
  },
  subscribeToPeriod(periodListener) {
    this.periodListeners = this.periodListeners.concat(periodListener);
  },
  setRegion(region) {
    if (
      !Object.values(REGIONS).includes(region) &&
      !countryNames.includes(region)
    ) {
      throw new Error(`Invalid argument for region: '${region}'`);
    }
    this.region = region;
    this.regionListeners.forEach((regionListener) => regionListener());
  },
  getRegion() {
    return this.region;
  },
  subscribeToRegion(regionListener) {
    this.regionListeners = this.regionListeners.concat(regionListener);
  },
  setStatus(status) {
    if (!Object.values(STATUSES).includes(status)) {
      throw new Error(`Invalid argument for status: '${status}'`);
    }
    this.status = status;
    this.statusListeners.forEach((statusListener) => statusListener());
  },
  getStatus() {
    return this.status;
  },
  subscribeToStatus(statusListener) {
    this.statusListeners = this.statusListeners.concat(statusListener);
  },
};

export default State;
