const mongoose = require('mongoose');
const databaseName = 'atelierReviews'
// const Schema = mongoose.Schema;
mongoose.connect(`mongodb://localhost:27017/${databaseName}`,
  () => console.log(`Connected to ${databaseName}`),
  (err) => console.log(err)
);

module.exports = mongoose;