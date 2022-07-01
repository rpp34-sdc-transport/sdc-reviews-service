/* eslint-disable no-unused-vars */
const mongoose = require('../db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
} = require('../db/schemas.js');

const connectDB = async () => {
  try {
    var counter = 0;
    var counter2 = 0;
    for await (const review of Reviews.find()) {

      var photos = await Photos.find({ review_id: review.id });
      var chars = await Characters.find({ review_id: review.id });
      try {
        await review.updateOne({
          photos: photos,
          characteristics: chars,
        }); //MUST HAVE AWAIT, or else will not go through!
      } catch (e) {
        console.log('Error on update doc:', e);
      }
      counter++;
      if (counter === 10000) {
        counter2 += counter;
        counter = 0;
        console.log(counter2, Date());
        var temp = await Reviews.find({ id: review.id })
        console.log(temp[0]);
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
