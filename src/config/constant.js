const constant = {
  MAX_LEN_PW: 10,
  // JWT_ACCESS_EXP: 15 * 60, // 15 menit
  JWT_ACCESS_EXP: 7 * 24 * 60 * 60, // 7 hari (temp)
  JWT_REFRESH_EXP: 30 * 24 * 60 * 60, // 30 hari
};
const userConstant = {
  EMAIL_VERIFIED_TRUE: 1,
  EMAIL_VERIFIED_FALSE: 0,
  STATUS_ACTIVE: 1,
  STATUS_INACTIVE: 0,
  STATUS_REMOVED: 2,
  ROLE_STUDENT: 7,
  ONTIME: '07:00:00',
};
export { userConstant };
export default constant;
