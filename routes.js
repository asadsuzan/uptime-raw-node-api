/*title: routes,
des: routes
author:suzan */

const { homeHandler } = require("./handlers/routeHandler/homeHandler");

const routes = {
  home: homeHandler,
};

module.exports = routes;
