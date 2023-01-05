const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

const JWT_SECRET = process.env.JWT_SECRET;

const openPaths = [
  "/apiAdmin/checkAuth",
  "/apiAdmin/auth/fbtoken",
  "/apiAdmin/auth/googletoken",
  "/apiAdmin/auth/appletoken",
  "/apiAdmin/saveGoogleUser",
  "/apiAdmin/saveFacebookUser",
  "/apiAdmin/saveAppleUser",
  "/apiAdmin/saveEmailUser",
  "/apiAdmin/generateTempPassword",
  "/apiAdmin/saveUserBySuburb",
  "/apiAdmin/signUp",
  "/apiAdmin/validateTokenPath",
  "/apiAdmin/cp/getCPInfo",
  "/apiAdmin/file/upload",
  "/apiAdmin/suburb/getInviteByCode",
  "/apiAdmin/notification/test",
  "/apiAdmin/suburb/getAllStreets",
  "/apiAdmin/userInfo/isPasswordTemp",
  "/apiAdmin/healthCheck",
];

const validateExpDate = function (expDate) {
  const currentTime = dayjs().unix();
  return expDate > currentTime;
};

const validateAuthorizationToken = (token) => {
  return new Promise(function (resolve, reject) {
    let isValid = false;
    try {
      jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (decoded) {
          if (validateExpDate(decoded.exp)) {
            isValid = true;
          }
        }
        resolve(isValid);
      });
    } catch (err) {
      console.log("validateAuthorizationToken error: ", err);
      reject(false);
    }
  });
};

const isOpenApi = (apiPath) => {
  return openPaths.some((path) => apiPath.startsWith(path));
};

const validateAuthorization = async (authToken, path) => {
  const validAuthToken = await validateAuthorizationToken(authToken);
  if (validAuthToken) {
    return true;
  }
  if (isOpenApi(path)) {
    return true;
  }
  return false;
};

module.exports = {
  validateAuthorization,
};
