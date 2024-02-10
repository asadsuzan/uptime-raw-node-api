const handler = {};

handler.homeHandler = function (reqObj, cb) {
  console.log("home");
  cb(200, {
    message: "home",
  });
};

module.exports = handler;
