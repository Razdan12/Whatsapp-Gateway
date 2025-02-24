export const returnError = (
  statusCode,
  error = { code: '', message: '' },
  data = null
) => {
  return {
    statusCode,
    response: {
      status: statusCode,
      data,
      error,
    },
  };
};

export const returnSuccess = (statusCode, data = {}) => {
  return {
    statusCode,
    response: {
      status: statusCode,
      data,
      error: null,
    },
  };
};
