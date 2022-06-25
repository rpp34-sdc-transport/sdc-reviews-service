const mongoose = require('mongoose');
require('dotenv').config();
const databaseName = process.env.MONGO_DB
const authDB = process.env.MONGO_AUTHDB;
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_TOKEN}@${process.env.MONGO_HOST}:27017/${databaseName}?authSource=${authDB}`,
  {},
  () => console.log(`Connected to ${databaseName}`),
  (err) => console.log(err)
);

module.exports = mongoose;