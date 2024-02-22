// dependencies
const lib = require("../../lib/data");
const { hash } = require("../../helpers/utilites");
const utilities = require("../../helpers/utilites");

// module scaffolding
const handler = {};

handler.tokenHandler = (reqObj, callback) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(reqObj.method) !== -1) {
    const method = handler._tokens[reqObj.method];
    method(reqObj, callback);
  } else {
    callback(404, {
      message: "method not accepted",
    });
  }
};

handler._tokens = {};

// create token
handler._tokens.post = (reqObj, callback) => {
  const phone =
    typeof reqObj.body.phone === "string" &&
    reqObj.body.phone.trim().length === 11
      ? reqObj.body.phone
      : null;

  const password =
    typeof reqObj.body.password === "string" &&
    reqObj.body.password.trim().length > 0
      ? reqObj.body.password
      : null;

  if (phone && password) {
    // check if registered user
    lib.read("users", phone, (err, data) => {
      if (!err && data) {
        const user = utilities.parseJson(data);
        const hashedPassword = hash(password);
        if (user.password === hashedPassword) {
          const tokenId = utilities.randomString(20);
          const expiresAt = Date.now() + 60 * 60 * 1000;
          const tokenData = {
            phone,
            expiresAt,
            tokenId,
          };
          // save token
          lib.create(
            "tokens",
            tokenId,
            utilities.stringify(tokenData),
            (err) => {
              if (!err) {
                callback(201, { message: "success", tokenData });
              } else {
                console.log(err);
                callback(500, { message: "there is something went wrong" });
              }
            }
          );
        } else {
          callback(400, { message: "wrong password" });
        }
      } else {
        callback(400, { message: "user not found" });
      }
    });
  } else {
    callback(400, { message: "invalid credentials" });
  }
};

// get token data
handler._tokens.get = (reqObj, callback) => {
  const id =
    typeof reqObj.query.id === "string" && reqObj.query.id.trim().length === 20
      ? reqObj.query.id
      : null;
  console.log(id);
  if (id) {
    // lookup token data
    lib.read("tokens", id, (err, data) => {
      if (!err && data) {
        const tokenData = utilities.parseJson(data);
        callback(200, {
          tokenData,
        });
      } else {
        callback(404, { message: "token not found" });
      }
    });
  } else {
    callback(404, { message: "invalid token" });
  }
};

//update token
handler._tokens.put = (reqObj, callback) => {
  const tokenId =
    typeof reqObj.body.tokenId === "string" &&
    reqObj.body.tokenId.trim().length === 20
      ? reqObj.body.tokenId
      : null;

  const extend =
    typeof reqObj.body.extend === "boolean" && reqObj.body.extend === true;

  if (tokenId && extend) {
    lib.read("tokens", tokenId, (err, data) => {
      if (!err && data) {
        const tokenObj = utilities.parseJson(data);
        if (tokenObj.expiresAt > Date.now()) {
          tokenObj.expiresAt = Date.now() + 60 * 60 * 1000;

          // update data
          const tokenString = utilities.stringify(tokenObj);

          lib.update("tokens", tokenId, tokenString, (errorUpdate) => {
            if (!errorUpdate) {
              callback(200, { message: "updated successfully" });
            } else {
              callback(500, { message: "something went wrong" });
            }
          });
        } else {
          callback(400, { message: "token expired" });
        }
      } else {
        callback(404, { message: "invalid token id" });
      }
    });
  } else {
    callback(404, { message: "there is problem in your request" });
  }
};

// delete token
handler._tokens.delete = (reqObj, callback) => {
  const tokenId =
    typeof reqObj.query.tokenId === "string" &&
    reqObj.query.tokenId.trim().length === 20
      ? reqObj.query.tokenId
      : null;

  if (tokenId) {
    lib.read("tokens", tokenId, (err, data) => {
      if (!err && data) {
        lib.delete("tokens", tokenId, (err) => {
          if (!err) {
            callback(200, { message: "deleted successfully" });
          } else {
            callback(500, { message: "server error" });
          }
        });
      } else {
        callback(404, { message: "token not found" });
      }
    });
  } else {
    callback(404, { message: "invalid token id" });
  }
};

// verify  token
handler.verifyToken = (token, phone, callback) => {
  lib.read("tokens", token, (err, data) => {
    if (!err && data) {
      const parsedData = utilities.parseJson(data);
      if (parsedData.phone === phone && parsedData.expiresAt > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
