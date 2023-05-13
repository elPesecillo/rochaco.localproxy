const dayjs = require("dayjs");

const ValidateExpDate = (expDate) => {
  const currentTime = dayjs().unix();
  return expDate > currentTime;
};

module.exports = {
  ValidateExpDate,
};
