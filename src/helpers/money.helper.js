function delimiter(inputNumber) {
  if (inputNumber === undefined || inputNumber === null) {
    return ''; // Handle undefined or null input gracefully
  }

  const numberString = `${inputNumber}`;
  const [integerPart, decimalPart] = numberString.split('.');

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedDecimal = decimalPart ? `.${decimalPart}` : ''; // Handle decimal part if exists

  return `${formattedInteger}${formattedDecimal}`;
}

export { delimiter };
