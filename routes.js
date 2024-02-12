/*title: routes,
des: routes
author:suzan */

const { homeHandler } = require("./handlers/routeHandler/homeHandler");
const { userHandler } = require("./handlers/routeHandler/userHandlers");

const routes = {
  home: homeHandler,
  user: userHandler,
};

module.exports = routes;
