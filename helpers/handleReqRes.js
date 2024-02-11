/*title: handleReqRes,
des: handleReqRes
author:suzan */

// dependance
const url = require("url");
const routes = require("../routes");
const { notFoundHandler } = require("../handlers/routeHandler/notFound");
const { StringDecoder } = require("string_decoder");

// module scaffolding
const handler = {};

// handleReqRes

handler.handleReqRes = function (req, res) {
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimPath = path.replace(/^\/|\/$/g, "");
  const method = req.method.toLowerCase();
  const queryObj = parsedUrl.query;
  const headersObj = req.headers;
  const decoder = new StringDecoder("utf-8");
  let data = "";

  const reqObj = { trimPath, method, queryObj, headersObj };

  const selectedRoute = routes[trimPath] ? routes[trimPath] : notFoundHandler;

  req.on("data", (buffer) => {
    data += decoder.write(buffer);
  });
  req.on("end", () => {
    data += decoder.end();
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.log(error.message);
    }
    selectedRoute(reqObj, (statusCode, payload) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(payload));
    });
  });
};

module.exports = handler;
