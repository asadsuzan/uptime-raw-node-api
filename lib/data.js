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
      fs.writeFile(fd, data, (errorForWrite) => {
        if (!errorForWrite) {
          fs.close(fd, (errorForClose) => {
            if (!errorForClose) {
              callback(false);
            } else {
              callback(errorForClose);
            }
          });
        } else {
          callback(errorForWrite);
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

// update data
lib.update = (dir, file, data, callback) => {
  //file open for writing
  fs.open(`${lib.baseDir + dir}/${file}.json`, "r+", (err, fd) => {
    if (!err && fd) {
      // truncate the file
      fs.ftruncate(fd, (err) => {
        if (!err) {
          //  write the file
          fs.writeFile(fd, data, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

// delete file
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};

module.exports = lib;
