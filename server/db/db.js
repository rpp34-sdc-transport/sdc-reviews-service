const mongoose = require('mongoose');
require('dotenv').config();
const databaseName = process.env.MONGO_DB
const host = process.env.MONGO_HOST;

if (host === 'localhost') {
  mongoose.connect(`mongodb://${host}/${databaseName}`,
    {},
    () => console.log(`Connected to ${databaseName}`),
    (err) => console.log(err)
  );
} else {
  mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_TOKEN}@${host}:27017/${databaseName}?authSource=${databaseName}`,
    {},
    () => console.log(`Connected to ${databaseName}`),
    (err) => console.log(err)
  );
}



module.exports = mongoose;