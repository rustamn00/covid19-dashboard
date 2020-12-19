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

export default Select;
