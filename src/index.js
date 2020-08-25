var express = require("express");
var request = require("request");
var cors = require("cors");
var app = express();
require("dotenv").config();

var map = require("./proxyRouter");
require("@babel/polyfill");

const getMap = (url) => {
  let proxyMap = map;
  let urlParts = url.split("/");
  let foundMap = null;
  for (let i = 0; i <= urlParts.length; i++) {
    if (!foundMap) {
      let innerArray = Array.apply(null, {
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

const rewriteURL = (protocol, host, url) => {
  let completeUrl = `${protocol}://${host}${url}`;
  let path = getMap(url);
  if (path) {
    let regex = new RegExp(Object.keys(path.pathRewrite)[0]);
    var replaced = completeUrl.replace(
      regex,
      path.pathRewrite[Object.keys(path.pathRewrite)[0]]
    );
    return `${path.target}${replaced}`;
  } else return completeUrl;
};

app.use(cors());
app.use("/testConfig", async function (req, res) {
  let secApi = process.env.MOBILE_SECURITY_API;
  let secApiCode = process.env.MOBILE_SECURITY_API_CODE;
  res.json({
    test: "hello",
    //secApi,
    //secApiCode,
  });
});

app.use("/", async function (req, res) {
  //var url = apiServerHost + req.url;
  try {
    var url = rewriteURL(req.protocol, req.get("Host"), req.url);
    var urlParts = req.url.split("/");

    console.log("url to do de request: ", url);
    req
      .pipe(
        request({ url: url }, (error, response, body) => {
          if (error) {
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
  } catch (ex) {
    req.res.status(500).json({
      exception: ex,
    });
  }
});

app.listen(process.env.PORT || 19007);
