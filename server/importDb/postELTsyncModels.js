const mongoose = require('mongoose');
const databaseName = 'atelierReviews';
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
  ReviewIncrementer
} = require('../db/schemas.postELT.js');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
    console.log('MongoDB connected!!', Date());

    try {
      await ReviewIncrementer.collection.drop();
    } catch (e) {
      console.log(e.message)
    }

    await Promise.all([
      CharDescs.init(),
      ReviewMetas.init(),
      Reviews.init(),
      Photos.init(),
      Characters.init(),
      ReviewIncrementer.init(),
    ]);
    await mongoose.syncIndexes();

    var [{ review_id }] = await Reviews.find({}).sort({ _id: -1 }).limit(1); //returns an array
    console.log('Last Inserted review_id', review_id);
    var incrementer = await ReviewIncrementer.create({ review_id: review_id + 1 });
    console.log('Next reivew_id will be', incrementer.review_id);

    console.log('all collection indexes synced', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);

  }
  await mongoose.connection.close();
};

connectDB();

