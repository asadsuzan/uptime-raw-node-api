/*title: raw nodejs api,
des: raw nod js api with no dependence 
author:suzan */

// dependence

const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const { create, read } = require("./lib/data");

// app object -- scaffolding
const app = {};

// config
app.config = {
  port: 8080,
};

// create("test", "new", { name: "suzan", country: "bangladesh" }, (e) => {
//   console.log(e);
// });
// read("test", "new", (err, data) => {
//   if (!err) {
//     console.log(JSON.parse(data));
//   } else {
//     console.log(err);
//   }
// });

// handle request and response
app.handleReqRes = handleReqRes;
// create server using http
app.createServer = function () {
  const server = http.createServer(app.handleReqRes);

  server.listen(app.config.port, () => {
    console.log(`environment variable is ${process.env.PORT}`);
    console.log(`listening on port: ${app.config.port}`);
  });
};

// start the server
app.createServer();
