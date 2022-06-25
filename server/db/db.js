const mongoose = require('mongoose');
require('dotenv').config();
const databaseName = process.env.MONGO_DB
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_TOKEN}@${process.env.MONGO_HOST}:27017/${databaseName}?authSource=${databaseName}`,
  {

  },
  () => console.log(`Connected to ${databaseName}`),
  (err) => console.log(err)
);

module.exports = mongoose;