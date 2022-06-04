const mongoose = require('mongoose');
const databaseName = 'atelierReviews';
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
} = require('../db/schemas.postELT.js');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
    console.log('MongoDB connected!!', Date());

    await CharDescs.init();
    await ReviewMetas.init();
    await Reviews.init();
    await Photos.init();
    await Characters.init();

    await mongoose.syncIndexes();
    console.log('all collection indexes synced', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

