/*
TITLE: UTILITIES
DESCRIPTION: UTILITY RELATED THINGS  
AUTHOR:ASAD SUZAN
*/

// dependencies
const crypto = require("crypto");

//  UTILITIES -- SCAFFOLDING

const utilities = {};

//parse json string to js object
utilities.parseJson = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    console.log(error);
    output = {};
  }

  return output;
};

// stringify js object
utilities.stringify = (jsObj) => {
  let output;

  try {
    output = JSON.stringify(jsObj);
  } catch (error) {
    console.log(error);
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length) {
    const hash = crypto.createHash("sha256").update(str).digest("hex");
    return hash;
  }
  return false;
};

// generate random string
utilities.randomString = (strLength) => {
  return crypto.randomBytes(32).toString("hex");
};
module.exports = utilities;
