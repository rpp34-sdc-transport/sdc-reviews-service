const mongoose = require('../server/db/db.js');
const {
  Reviews,
  ReviewIncrementer
} = require('../server/db/schemas.postELT.js');

const connectDB = async () => {
  try {
    console.log('MongoDB connected!: Cleaning up After testing', Date());

    // Deleting added reviews
    try {
      await Reviews.deleteMany({ _id: { $gt: mongoose.Types.ObjectId('629578bd53dce13150a30bf2') } })
    } catch (e) {
      console.log(e.message)
    }

    // set all reviews to not reported
    try {
      await Reviews.updateMany({}, { $set: { reported: false } })
    } catch (e) {
      console.log(e.message)
    }

    // resetting the incrementer for the review_id
    try {
      await ReviewIncrementer.collection.drop();
    } catch (e) {
      console.log(e.message)
    }

    console.log('Clean up completed', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);

  }
  await mongoose.connection.close();
};

connectDB();

