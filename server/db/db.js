const mongoose = require('mongoose');
const databaseName = 'atelierReviews'
mongoose.connect(`mongodb://localhost:27017/${databaseName}`,
  () => console.log(`Connected to ${databaseName}`),
  (err) => console.log(err)
);

module.exports = mongoose;