/*
TITLE:UPTIME MONITORING API - RAW NODEJS
DESCRIPTION: MODULE FOR HANDLING REQUEST AND RESPONSE  
AUTHOR:ASAD SUZAN
*/

// dependence

const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const lib = require("./lib/data");
const { error } = require("console");

// App object -- scaffolding
const app = {};

// configuration
app.config = {
  port: 5000,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.config.port, () => {
    console.log(`listening on port: ${app.config.port}`);
  });
};
// handle request and response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
