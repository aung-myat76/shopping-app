const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
    mongoClient
        .connect(
            "mongodb+srv://aung_myat:zz762389@nodejs.4lf0iqx.mongodb.net/shop?retryWrites=true&w=majority&appName=Nodejs"
        )
        .then((client) => {
            _db = client.db();
            console.log("Connected Successfully!");
            cb();
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw "Database not found!";
    }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
