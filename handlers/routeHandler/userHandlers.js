// dependencies
const lib = require("../../lib/data");

// module scaffolding
const handler = {};

handler.userHandler = (reqObj, callback) => {
  const acceptedMethods = ["post", "get", "put", "delete"];
  if (acceptedMethods.indexOf(reqObj.method) !== -1) {
    const method = handler._users[reqObj.method];
    method(reqObj, callback);
  } else {
    callback(404, {
      message: "method not accepted",
    });
  }
};

handler._users = {};

// signup new user
handler._users.post = (reqObj, callback) => {
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
      ? reqObj.body.phone
      : null;

  const tosAgreement =
    typeof reqObj.body.tosAgreement === "boolean"
      ? reqObj.body.tosAgreement
      : false;

  if (firstName && lastName && password && tosAgreement) {
    const user = {
      firstName,
      lastName,
      password,
      tosAgreement,
    };
    let strData = JSON.stringify(user);
    console.log(typeof strData);
    lib.create("users", phone, strData, (err) => {
      if (!err) {
        callback(201, {
          message: "user created successfully",
        });
      } else {
        callback(500, {
          message: "sever error",
        });
      }
    });
  } else {
    callback(400, {
      message: "all the filed are required",
    });
  }
};

// get user data
handler._users.get = (reqObj, callback) => {
  const phone =
    typeof reqObj.queryObj.phone === "string" &&
    reqObj.queryObj.phone.trim().length === 11
      ? reqObj.queryObj.phone
      : null;

  if (phone) {
    lib.read("users", phone, (err, data) => {
      if (!err && data) {
        const parsedData = JSON.parse(data);
        callback(200, {
          data: data,
        });
      } else {
        callback(404, { message: "user not found" });
      }
    });
  } else {
    callback(404, { message: "user not found" });
  }
};

//update user
handler._users.put = (reqObj, callback) => {
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
      ? reqObj.body.phone
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
          user.password = password;
        }
        user = JSON.stringify(user);
        // update data
        lib.update("users", phone, user, (err) => {
          if (err) {
            console.log("updated");
            callback(200);
          } else {
            console.log(err);
            callback(500);
          }
        });
      } else {
        callback(404, { messaage: "user not found" });
      }
    });
  } else {
    callback(404, { message: "user not found, invalid phone number" });
  }
};

// delete user
handler._users.delete = (reqObj, callback) => {
  const phone =
    typeof reqObj.queryObj.phone === "string" &&
    reqObj.queryObj.phone.trim().length === 11
      ? reqObj.queryObj.phone
      : null;

  if (phone) {
    lib.read("users", phone, (err, data) => {
      if (!err && data) {
        lib.delete("users", phone, (err) => {
          if (!err) {
            callback(200, { message: "user deleted" });
          } else {
            console.log(err);
            callback(500, { mesage: "server error" });
          }
        });
      } else {
        callback(404, { messaage: "user not found" });
      }
    });
  }
};

module.exports = handler;
