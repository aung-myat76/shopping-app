const fs = require("fs");

exports.deleteFile = (filePath) => {
    fs.unlink(filePath, (err, data) => {
        if (err) {
            console.log(err);
        }
    });
};
