const capitalize = (str) => str.slice(0, 1).toUpperCase().concat(str.slice(1));

const addThousandsSeparator = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default { capitalize, addThousandsSeparator };
