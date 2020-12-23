const capitalize = (str) => str.slice(0, 1).toUpperCase().concat(str.slice(1));

const addThousandsSeparator = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const convertToShortNum = (num) => {
  if (num >= 10 ** 6) {
    return `${Math.round(num / 10 ** 6)}M`;
  }
  if (num >= 10 ** 3) {
    return `${Math.round(num / 10 ** 3)}k`;
  }
  return addThousandsSeparator(num);
};

export default { capitalize, addThousandsSeparator, convertToShortNum };
