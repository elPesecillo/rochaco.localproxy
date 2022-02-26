const map = {
  "/apiAdmin": {
    target: `${process.env.ADMIN_API}`,
    pathRewrite: {
      "^.+apiAdmin": "",
    },
  },
  "/apiServices": {
    target: `${process.env.SERVICES_API}`,
    pathRewrite: {
      "^.+apiServices": "",
    },
  },
  "/apiPayments": {
    target: `${process.env.PAYMENTS_API}`,
    pathRewrite: {
      "^.+apiPayments": "",
    },
  },
  "/apiSurveys": {
    target: `${process.env.SURVEYS_API}`,
    pathRewrite: {
      "^.+apiSurveys": "",
    },
  },
  "/apiSpaces": {
    target: `${process.env.SPACES_API}`,
    pathRewrite: {
      "^.+apiSpaces": "",
    },
  },
};

module.exports = map;
