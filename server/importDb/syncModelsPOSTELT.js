const mongoose = require('../db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  ReviewIncrementer
} = require('../db/schemas.postELT.js');

const connectDB = async () => {
  try {

    try {
      await ReviewIncrementer.collection.drop();
    } catch (e) {
      console.log(e.message)
    }

    await Promise.all([
      CharDescs.init(),
      ReviewMetas.init(),
      Reviews.init(),
      ReviewIncrementer.init(),
    ]);
    await mongoose.syncIndexes();

    console.log('all collection indexes synced', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);

  }
  await mongoose.connection.close();
};

connectDB();

