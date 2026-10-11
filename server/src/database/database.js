const mongoose = require('mongoose');

//we are just wrapping the function inside promise
//what to do after connection and how to handle error will be defined inside index.js

function connectDb() {
    return new Promise((resolve, reject) => {
        mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        .then(connectionInstance => resolve(connectionInstance))
        .catch(error => reject(error));
    });
}

module.exports = connectDb;