import moment from 'moment';

export function isInteger(value) {
  return /^\d+$/.test(value);
}

export function isBoolean(value) {
  return value === 'true' || value === 'false';
}

export function isDateAble(value) {
  return moment(value).isValid();
}

export function isObject(variable) {
  return typeof variable === 'object' && variable !== null;
}

export function parseString(val) {
  let convertedVal;
  if (val === 'null') {
    convertedVal = null;
  } else if (val === 'true' || val === 'false') {
    convertedVal = val === 'true';
  } else if (!isNaN(Number(val))) {
    convertedVal = Number(val);
  } else {
    convertedVal = String(val);
  }

  return convertedVal;
}
