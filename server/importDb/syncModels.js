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

