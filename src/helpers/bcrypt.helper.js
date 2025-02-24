import bcrypt from 'bcrypt';

const SALT_ROUND = 10;

export const hash = async (text) => {
  return bcrypt.hash(text, SALT_ROUND).then(function (hash) {
    return hash;
  });
};

export const compare = async (text, hash) => {
  return bcrypt.compare(text, hash).then(function (result) {
    return result;
  });
};
