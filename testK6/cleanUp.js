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
      await Reviews.deleteMany({ review_id: { $gt: 5774952 } })
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

    var [{ review_id }] = await Reviews.find({}).sort({ _id: -1 }).limit(1); //returns an array
    console.log('Last Inserted review_id', review_id); // New Db Should be 5774952
    var incrementer = await ReviewIncrementer.create({ review_id: review_id + 1 });
    console.log('Next reivew_id will be', incrementer.review_id);

    console.log('Clean up completed', Date());

  } catch (err) {
    console.log('Failed to connect to MongoDB', err);

  }
  await mongoose.connection.close();
};

connectDB();

