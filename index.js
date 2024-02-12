/*title: raw nodejs api,
des: raw nod js api with no dependence 
author:suzan */

// dependence

const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const lib = require("./lib/data");

// app object -- scaffolding
const app = {};

// config
app.config = {
  port: 8080,
};

// create server using http
app.createServer = function () {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.config.port, () => {
    console.log(`listening on port: ${app.config.port}`);
  });
};
// handle request and response
app.handleReqRes = handleReqRes;
// start the server
app.createServer();
