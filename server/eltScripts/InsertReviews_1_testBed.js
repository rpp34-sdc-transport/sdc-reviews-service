const csv = require('csv-parser');
const fs = require('fs');
// const mongoose = require('./db/db.js');
const mongoose = require('mongoose');
const databaseName = 'testDb';
const { Reviews } = require('../db/schemas.js');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
    console.log('MongoDB connected!!');

    try {
      await Reviews.collection.drop();
    } catch (e) {
      console.log(e.message)
    }
    await Reviews.init();

    var array = [];
    // var counter = 0;
    const stream = fs.createReadStream('/Users/Zhaowei/rpp34/elt_data_sdc/reviews.csv')

    console.log(Date());
    stream.pipe(csv())
      .on('data', async (row) => {
        try {
          array.push(row);
          console.log(`Array RunSize: ${array.length}`)
          if (array.length === 50) {
            await stream.pause(); // This Await is important as this actually waits for the stream to pause.
            // counter += 10000;
            console.log(`**************** Array Size PRE INSERT: ${array.length}`)
            await Reviews.insertMany(array);
            // console.log(`${counter} rows`);
            console.log(`**************** Array Size POST INSERT: ${array.length}`)
            array = [];
            stream.resume();
          }
        } catch (err) {
          console.log('Db Write failed', err);
        }
      })
      .on('end', async () => {
        // counter += array.length;
        await Reviews.insertMany(array);
        array = [];
        // console.log(`${counter} rows`);
        console.log('end of stream');
        console.log(Date());
        console.log('INDEXING');
        Reviews.syncIndexes();
        console.log(Date());
        console.log('END');
      });

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

