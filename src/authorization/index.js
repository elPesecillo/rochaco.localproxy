const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const openPaths = require("./publicPaths");
const automatedPaths = require("./automatedPaths");
const common = require("../utils/common");

const { JWT_SECRET } = process.env;

const validateAuthorizationToken = (token) =>
  new Promise((resolve, reject) => {
    let isValid = false;
    try {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (decoded) {
          if (common.ValidateExpDate(decoded.exp)) {
            isValid = true;
          }
        }
        resolve({ ...decoded, isValid });
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("validateAuthorizationToken error: ", err);
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(false);
    }
  });

const validateAuthorization = async (authToken, path, macAddress) => {
  // TODO: use the decoded token to get the user role and validate
  // if the user role has access to the path
  const decodedToken = await validateAuthorizationToken(authToken);
  if (decodedToken?.isValid) {
    return true;
  }
  if (automatedPaths.IsAutomatedPath(path, macAddress)) {
    return true;
  }
  if (openPaths.IsPublicPath(path)) {
    return true;
  }
  return false;
};

const GeneratePartnerToken = (partner, minutesToExpire = 44640) => {
  const expDate = dayjs().add(minutesToExpire, "minute").unix();
  const token = jwt.sign(
    { partner, exp: expDate },
    process.env.JWT_PARTNER_SECRET
  );
  return token;
};

module.exports = {
  validateAuthorization,
  GeneratePartnerToken,
};
