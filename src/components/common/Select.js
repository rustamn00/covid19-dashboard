import { PERIODS, STATUSES, UNITS } from 'utils/constants';
import helpers from 'utils/helpers';
import State from 'utils/State';

const Select = (selectData, defaultValue, onChange) => {
  const select = document.createElement('select');

  selectData.forEach(({ value, title }) => {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = title;
    option.selected = value === defaultValue;
    select.appendChild(option);
  });

  select.addEventListener('change', () => onChange(select.value));

  return select;
};

const [Status, Unit, Period] = [
  [
    STATUSES,
    () => State.getStatus(),
    (status) => helpers.capitalize(status),
    (status) => State.setStatus(status),
  ],
  [
    UNITS,
    () => State.getUnit(),
    (unit) => (unit === UNITS.ABSOLUTE ? 'Total' : 'Per 100k pop'),
    (unit) => State.setUnit(unit),
  ],
  [
    PERIODS,
    () => State.getPeriod(),
    (period) => helpers.capitalize(period.replace('_', ' ')),
    (period) => State.setPeriod(period),
  ],
].map(([valuesObj, getCurrentValue, titleHelper, onChange]) => {
  const selectData = Object.values(valuesObj).map((value) => ({
    title: titleHelper(value),
    value,
  }));
  return () => Select(selectData, getCurrentValue(), onChange);
});

export default {
  Status,
  Unit,
  Period,
};
