const handler = {};

handler.homeHandler = function (reqObj, cb) {
  cb(200, {
    message: "home",
  });
};

module.exports = handler;
