const map = {
  "/apiAdmin": {
    target: `${process.env.ADMIN_API}`,
    pathRewrite: {
      "^.+apiAdmin": "",
    },
  },
  "/apiServices": {
    target: `${process.env.SERVICES_API}`,
    code: process.env.SERVICES_API_CODE,
    pathRewrite: {
      "^.+apiServices": "",
    },
  },
  "/apiPayments": {
    target: `${process.env.PAYMENTS_API}`,
    code: process.env.PAYMENTS_API_CODE,
    pathRewrite: {
      "^.+apiPayments": "",
    },
  },
  "/apiSurveys": {
    target: `${process.env.SURVEYS_API}`,
    code: process.env.SURVEYS_API_CODE,
    pathRewrite: {
      "^.+apiSurveys": "",
    },
  },
  "/apiSpaces": {
    target: `${process.env.SPACES_API}`,
    code: process.env.SPACES_API_CODE,
    pathRewrite: {
      "^.+apiSpaces": "",
    },
  },
};

module.exports = map;
