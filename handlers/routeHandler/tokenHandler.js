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
                callback(500, { message: "there is something went wrong" });
              }
            }
          );
        } else {
          callback(400, { message: "wrong password" });
        }
      } else {
        callback(400, { message: "data nai" });
      }
    });
  } else {
    callback(400, { message: "invalid credentials" });
  }
};

// get token data
handler._tokens.get = (reqObj, callback) => {
  const phone =
    typeof reqObj.query.phone === "string" &&
    reqObj.query.phone.trim().length === 11
      ? reqObj.query.phone
      : null;

  if (phone) {
    lib.read("users", phone, (err, data) => {
      if (!err && data) {
        const user = JSON.parse(data);
        delete user.password;

        callback(200, {
          data: user,
        });
      } else {
        callback(404, { message: "user not found" });
      }
    });
  } else {
    callback(404, { message: "invalid phone number" });
  }
};

//update token
handler._tokens.put = (reqObj, callback) => {
  const firstName =
    typeof reqObj.body.firstName === "string" &&
    reqObj.body.firstName.trim().length > 0
      ? reqObj.body.firstName
      : null;

  const lastName =
    typeof reqObj.body.lastName === "string" &&
    reqObj.body.lastName.trim().length > 0
      ? reqObj.body.lastName
      : null;

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

  if (phone) {
    lib.read("users", phone, (err, data) => {
      if (!err && data) {
        let user = { ...JSON.parse(data) };

        if (firstName) {
          user.firstName = firstName;
        }
        if (lastName) {
          user.lastName = lastName;
        }
        if (password) {
          user.password = hash(password);
        }
        const stringUser = JSON.stringify(user);

        // update data
        lib.update("users", phone, stringUser, (err) => {
          if (err) {
            callback(200, { message: "updated successfully" });
          } else {
            callback(500, { message: "something went wrong" });
          }
        });
      } else {
        callback(404, { message: "user not found" });
      }
    });
  } else {
    callback(404, { message: "invalid phone number" });
  }
};

// delete token
handler._tokens.delete = (reqObj, callback) => {
  const phone =
    typeof reqObj.query.phone === "string" &&
    reqObj.query.phone.trim().length === 11
      ? reqObj.query.phone
      : null;
  // console.log(reqObj.query.phone);
  // console.log(phone);
  if (phone) {
    lib.read("users", phone, (err, data) => {
      if (!err && data) {
        lib.delete("users", phone, (err) => {
          if (!err) {
            callback(200, { message: "user deleted" });
          } else {
            console.log(err);
            callback(500, { messaage: "server error" });
          }
        });
      } else {
        callback(404, { messaage: "user not found" });
      }
    });
  } else {
    callback(404, { messaage: "invalid phone number" });
  }
};

module.exports = handler;
