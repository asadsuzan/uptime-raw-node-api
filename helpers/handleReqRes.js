/*
TITLE: REQ-RES HANDLER
DESCRIPTION: MODULE FOR HANDLING REQUEST AND RESPONSE  
AUTHOR:ASAD SUZAN
*/

// dependance
const url = require("url");
const routes = require("../routes");
const { notFoundHandler } = require("../handlers/routeHandler/notFound");
const { StringDecoder } = require("string_decoder");
// const { parseJson } = require("./utilites");
const utilities = require("../helpers/utilites");

// module scaffolding
const handler = {};

// handleReqRes
handler.handleReqRes = function (req, res) {
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimPath = path.replace(/^\/|\/$/g, ""); // REMOVE LEADING AND   trailing slashes
  const method = req.method.toLowerCase();
  const query = parsedUrl.query;
  const headers = req.headers;

  // CONSTRUCT THE REQUEST OBJECT
  const requestObj = { path: trimPath, method, query, headers };
  const decoder = new StringDecoder("utf-8");
  let data = "";

  // DETERMINE THE ROUTE OR USE THE notFoundHandler
  const selectedRoute = routes[requestObj.path]
    ? routes[requestObj.path]
    : notFoundHandler;

  // Event listener for incoming data

  req.on("data", (buffer) => {
    data += decoder.write(buffer);
  });

  //EVENT LISTENER FOR END OF THE REQUEST
  req.on("end", () => {
    data += decoder.end();

    requestObj.body = utilities.parseJson(data);

    // CALL THE selectedRoute and handle the response
    selectedRoute(requestObj, (statuscode, payload) => {
      statuscode = typeof statuscode === "number" ? statuscode : 500;
      payload = typeof payload === "object" ? payload : { message: "success" };

      payload = utilities.stringify(payload);
      res.setHeader("Content-Type", "application/json");
      res.end(payload);
    });
  });
};

module.exports = handler;
