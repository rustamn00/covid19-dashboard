import { PERIODS, UNITS, REGIONS } from './constants';

const State = {
  init() {
    this.region = REGIONS.GLOBAL;
    this.period = PERIODS.TOTAL;
    this.unit = UNITS.ABSOLUTE;
  },
  setUnit(unit) {
    this.unit = unit;
  },
  getUnit() {
    return this.unit;
  },
  setPeriod(period) {
    this.period = period;
  },
  getPeriod() {
    return this.period;
  },
  setRegion(region) {
    this.region = region;
  },
  getRegion() {
    return this.region;
  },
};

export default State;
