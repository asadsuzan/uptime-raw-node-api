/*title: routes,
des: routes
author:suzan */

const { homeHandler } = require("./handlers/routeHandler/homeHandler");
const { tokenHandler } = require("./handlers/routeHandler/tokenHandler");
const { userHandler } = require("./handlers/routeHandler/userHandlers");

const routes = {
  home: homeHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
