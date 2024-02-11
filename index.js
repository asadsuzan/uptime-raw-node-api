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

// lib.create(
//   "users",
//   "01614010594",
//   { name: "suzan", password: "asad1234" },
//   (e) => {
//     console.log(e);
//   }
// );

// lib.read("users", "01614010594", (err, data) => {
//   if (!err) {
//     console.log(JSON.parse(data));
//   } else {
//     console.log(err);
//   }
// });

lib.update(
  "users",
  "01614010594",
  { name: "suzan", passord: "1234567" },
  (err) => {
    console.log(err);
  }
);
lib.delete("users", "o1614010596", (e) => {
  console.log(e);
});

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
