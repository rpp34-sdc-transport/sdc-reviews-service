const mongoose = require('../db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
} = require('../db/schemas.postELT.js');

const connectDB = async () => {
  try {
    await Promise.all([
      CharDescs.init(),
      ReviewMetas.init(),
      Reviews.init(),
    ]);
    await mongoose.syncIndexes();

    console.log('all collection indexes synced', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);

  }
  await mongoose.connection.close();
};

connectDB();

