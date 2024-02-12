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

// update data
lib.update = (dir, file, data, callback) => {
  //file open for writing
  fs.open(`${lib.baseDir + dir}/${file}.json`, "r+", (err, fd) => {
    if (!err && fd) {
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fd, (err) => {
        if (!err) {
          //  write the file
          fs.writeFile(fd, stringData, (err) => {
            if (!err) {
              callback("updated success");
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
      callback("delete success");
    } else {
      callback(err);
    }
  });
};

module.exports = lib;
