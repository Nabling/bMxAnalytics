var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var path = require("path");
var app = express();

let config;
if (app.settings.env === "development") {
  config = require("./config.js"); // Get our config info (app id and app secret)
}
var client_id =
  process.env.CLIENT_ID || process.env.APPSETTING_CLIENT_ID || config.CLIENT_ID; // Your client sid
var client_secret =
  process.env.CLIENT_SECRET ||
  process.env.APPSETTING_CLIENT_SECRET ||
  config.CLIENT_SECRET; // Your secret
var redirect_uri =
  process.env.REDIRECT_URI ||
  process.env.APPSETTING_REDIRECT_URI ||
  config.REDIRECT_URI; // Your redirect uri
var port = process.env.PORT || process.env.APPSETTING_PORT || config.PORT;
const showpadAccount = process.env.SHOWPAD_ACCOUNT || "biomerieux";
const baseUri = `https://${showpadAccount}.showpad.biz/api/v3`;

console.log("client_id", client_id);
console.log("redirect_uri", redirect_uri);

console.log("app.settings.env", app.settings.env);
var DIST_DIR = path.join(__dirname, "dist");

app.use(express.static(DIST_DIR)).use(cookieParser());

app.get("/proxy/*", function(req, res) {
  console.log("proxy called");
  const endpoint = req.url.replace("/proxy", "");
  console.log("baseUri + endpoint", baseUri + endpoint);
  req.pipe(request(baseUri + endpoint)).pipe(res);
});

app.get("/login", function(req, res) {
  // your application requests authorization
  console.log("login attempt");

  res.redirect(
    `${baseUri}/oauth2/authorize?` +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        redirect_uri: redirect_uri
      })
  );
});

app.get("/callback", function(req, res) {
  // STEP 3 - CODE SENT TO BACKEND
  console.log("/callback called. Exchanging code for access token");
  const code = req.query.code || null;
  console.log("code", code);

  const authOptions = {
    url: `${baseUri}/oauth2/token`,
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    json: true
  };

  // STEP 4 - CODE EXCHANGED FOR ACCESS TOKEN
  console.log("Requesting access token", authOptions);
  request.post(authOptions, function(error, response, body) {
    console.log("Received access token response");
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      // STEP 5 - TOKEN PASSED BACK TO THE CONNECTOR
      // Pass the token to the browser to make requests from there
      console.log("Redirecting back to start page");
      res.redirect(
        "/#" +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          })
      );
    } else {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "invalid_token"
          })
      );
    }
  });
});

app.get("/refresh_token", function(req, res) {
  // requesting access token from refresh token
  console.log("request refresh token", req.query.refresh_token);
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: `${baseUri}/oauth2/token`,
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

console.log("Listening on " + port);
app.listen(port);
