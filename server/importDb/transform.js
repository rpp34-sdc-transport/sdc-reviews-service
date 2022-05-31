/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const databaseName = 'atelierReviews';
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
} = require('../db/schemas.js');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
    console.log('MongoDB connected!!', Date());

    var counter = 1;
    var counter2 = 0;
    for await (const review of Reviews.find()) {

      //May need to make the code below promise based?
      var photos = await Photos.find({ review_id: review.id });
      var chars = await Characters.find({ review_id: review.id });
      try {
        review.updateOne({
          photos: photos,
          characteristics: chars,
        }); //Might need to await this once... we'll see!

      } catch (e) {
        console.log(e);
      }

      counter++;
      if (counter === 5000) {
        counter2 += counter;
        counter = 1;
        console.log(counter2, Date());
      }
    }
    counter2 += counter;
    console.log(counter2);

    console.log('Transform complete', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();
