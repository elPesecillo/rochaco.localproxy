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

const IsPublicPath = (path) => openPaths.some((p) => path.startsWith(p));

module.exports = {
  IsPublicPath,
};
