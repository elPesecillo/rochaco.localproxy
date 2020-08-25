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
};

module.exports = map;
