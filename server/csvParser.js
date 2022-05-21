const csv = require('csv-parser');
const fs = require('fs');
// const mongoose = require('./db/db.js');
const mongoose = require('mongoose');
const databaseName = 'atelierReviews';
const {Reviews} = require('./db/schemas.js');


// async function test() {
//   try {
//     await Reviews.collection.drop();
//     await Reviews.init();
//     var promise = [];
//     fs.createReadStream('./legacyAPI_examples/reviews.abridged.csv')
//       .pipe(csv())
//       .on('data', async (row) => {
//         results.push(row);
//         promise.push(Reviews.create(row));
//       })
//       .on('end', async () => {
//         console.log('end of stream');
//       });
//     await Promise.all(promise);
//   } catch (err) {
//     console.log(err)
//   }
// }

const connectDB = async () => {
  try {
      await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
      console.log('MongoDB connected!!');

      await Reviews.collection.drop();
      await Reviews.init();

      var array = [];
      var counter = 1;
      const stream = fs.createReadStream('/Users/Zhaowei/rpp34/elt_data_sdc/reviews.csv')
      stream.pipe(csv())
        .on('data', async (row) => {
          try{
            array.push(row);
            if (array.length === 10000) {
              stream.pause();
              console.log(10000*counter);
              await Reviews.insertMany(array);
              array = [];
              counter++;
              stream.resume();
            }
          } catch (err) {
            console.log('Db Write failed', err);
          }
        })
        .on('end', () => {
          console.log('end of stream');
        });

  } catch (err) {
      console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

