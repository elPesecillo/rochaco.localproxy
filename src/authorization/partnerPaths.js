const jwt = require("jsonwebtoken");
const common = require("../utils/common");

const { JWT_PARTNER_SECRET } = process.env;

const partnerPaths = ["/apiAdmin/partner/getRFs", "/apiAdmin/partner/setRFs"];

const isPartnerPath = (path) => partnerPaths.some((p) => path.startsWith(p));

const validatePartnerAuthorizationToken = (token) =>
  new Promise((resolve, reject) => {
    let isValid = false;
    try {
      jwt.verify(token, JWT_PARTNER_SECRET, (err, decoded) => {
        if (decoded && common.ValidateExpDate(decoded.exp)) {
          isValid = true;
        }
        resolve({ ...decoded, isValid });
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("validatePartnerAuthorizationToken error: ", err);
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(false);
    }
  });

const ValidatePartnerPath = async (path, partnerKey) => {
  if (isPartnerPath(path)) {
    const decodedToken = await validatePartnerAuthorizationToken(partnerKey);
    if (decodedToken?.isValid) {
      return true;
    }
  }
  return false;
};

module.exports = {
  ValidatePartnerPath,
};
