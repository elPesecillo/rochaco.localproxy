const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
require("dotenv").config();
require("@babel/polyfill");
const map = require("./proxyRouter");
const authorization = require("./authorization");
const { IsAutomatedPath } = require("./authorization/automatedPaths");
const { ValidatePartnerPath } = require("./authorization/partnerPaths");

const getMap = (url) => {
  const proxyMap = map;
  const urlParts = url.split("/");
  let foundMap = null;
  for (let i = 0; i <= urlParts.length; i += 1) {
    if (!foundMap) {
      // eslint-disable-next-line prefer-spread
      const innerArray = Array.apply(null, {
        length: i + 1,
      }).map(Function.call, Number);
      let uri = "";
      innerArray.forEach((element) => {
        uri += urlParts[element] !== "" ? `/${urlParts[element]}` : "";
      });
      foundMap = proxyMap[uri];
    }
  }
  return foundMap;
};

const addApiCodeParameter = (path, code) => {
  try {
    if (path.includes("?")) {
      return `${path}&code=${code}`;
    }
    return `${path}?code=${code}`;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error adding api code parameter #%d", err);
    return path;
  }
};

const rewriteURL = (protocol, host, url) => {
  const completeUrl = `${protocol}://${host}${url}`;
  const urlMap = getMap(url);
  if (urlMap) {
    const regex = new RegExp(Object.keys(urlMap.pathRewrite)[0]);
    let replaced = completeUrl.replace(
      regex,
      urlMap.pathRewrite[Object.keys(urlMap.pathRewrite)[0]]
    );
    if (urlMap.code) {
      replaced = addApiCodeParameter(replaced, urlMap.code);
    }
    return `${urlMap.target}${replaced}`;
  }
  return completeUrl;
};

app.use(cors());
app.use("/testConfig", async (req, res) => {
  const secApi = process.env.MOBILE_SECURITY_API;
  const secApiCode = process.env.MOBILE_SECURITY_API_CODE;
  res.json({
    test: "hello",
    secApi,
    secApiCode,
  });
});

app.use("/generatePartnerToken", async (req, res) => {
  const apiKey = req.headers["api-key"];
  if (apiKey === process.env.PROTECTED_API_KEY) {
    const { partner, minutesToExpire } = req.query;
    const token = authorization.GeneratePartnerToken(partner, minutesToExpire);
    res.json({
      token,
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.use("/", async (req, res) => {
  try {
    const url = rewriteURL(req.protocol, req.get("Host"), req.url);
    const authToken = req.headers.authorization;
    const macAddress = req.headers["x-mac-address"];
    const partnerKey = req.headers["x-partner-key"];
    const validToken = await authorization.validateAuthorization(
      authToken,
      req.url,
      macAddress
    );
    let validPartnerToken = false;

    if (partnerKey) {
      validPartnerToken = await ValidatePartnerPath(req.url, partnerKey);
    }

    if (IsAutomatedPath(req.url, macAddress) || validPartnerToken) {
      req.headers["api-key"] = process.env.PROTECTED_API_KEY;
    }
    if (validToken || validPartnerToken) {
      // eslint-disable-next-line no-console
      console.log("request redirected to: ", url);
      req
        .pipe(
          request({ url }, (error) => {
            if (error) {
              // eslint-disable-next-line no-console
              console.log(
                `An error occurs in the following url: ${url}: `,
                error
              );
              let message = "dev proxy error: ";
              if (error.code === "ECONNREFUSED") {
                message = message.concat("Refused connection");
              } else if (error.code === "ECONNRESET") {
                message = message.concat("The target connection has been lost");
              } else {
                message = message.concat("Unhandled error");
              }
              req.res.status(500).json({
                errorMessage: message || "",
                exception: message || {},
              });
            }
          })
        )
        .pipe(res);
    } else {
      req.res.status(401).json({ message: "Unauthorized" });
    }
  } catch (ex) {
    req.res.status(500).json({
      exception: ex?.message || "unknown error occurred",
    });
  }
});

app.listen(process.env.PORT || 19007);
