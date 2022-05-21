const csv = require('csv-parser');
const fs = require('fs');
// const mongoose = require('./db/db.js');
const mongoose = require('mongoose');
const databaseName = 'atelierReviews';
const { Photos } = require('../db/schemas.js');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
    console.log('MongoDB connected!!');

    // try {
    //   await Photos.collection.drop();
    // } catch (e) {
    //   console.log(e.message)
    // }
    await Photos.init();

    var array = [];
    var counter = 0;
    const stream = fs.createReadStream('/Users/Zhaowei/rpp34/elt_data_sdc/reviews_photos.csv')

    console.log(Date());
    stream.pipe(csv())
      .on('data', async (row) => {
        try {
          array.push(row);
          if (array.length === 10000) {
            /**
             * Dangerous Code below!
             *   Stream takes a while to stop, so the array is being expanded while Mongoose
             *   trying to insert.
             * Code works, but will need to consider that extra buffer memory needed
             *  for the extra 100-200 rows. This extra memory/rows will be dependant on the
             *  harware and other programs on the machine.
             * Can lead to program instability!!
            */
            stream.pause();
            await Photos.insertMany(array);
            counter += array.length;
            console.log(`${counter} rows`);
            array = [];
            stream.resume();
          }
        } catch (err) {
          console.log('Db Write failed', err);
        }
      })
      .on('end', async () => {
        counter += array.length;
        await Photos.insertMany(array);
        array = [];
        console.log(`${counter} rows`);
        console.log('end of stream');
        console.log(Date());
        console.log('INDEXING');
        Photos.syncIndexes();
        console.log(Date());
        console.log('END');
      });

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

