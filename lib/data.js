// dependencies
const fs = require("fs");

const path = require("path");
// module scaffolding
const lib = {};

//base directory of the data folder
lib.baseDir = path.join(__dirname, "../.data/");

//write data to file

lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir + dir}/${file}.json`, "wx", (errorForOpen, fd) => {
    if (!errorForOpen && fd) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fd, stringData, (errorForWrite) => {
        if (!errorForWrite) {
          fs.close(fd, (errorForClose) => {
            if (!errorForClose) {
              callback(false);
            } else {
              callback("there was an error close file");
            }
          });
        } else {
          callback("there was an error write file");
        }
      });
    } else {
      callback(errorForOpen);
    }
  });
};

//read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

module.exports = lib;
