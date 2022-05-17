const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewModelName = 'Reviews';
const metaModelName = 'ReviewMetas';

const photosSchema = new Schema({
  id: Number,
  url: String, //valid URL
});

// MAY CONVERT TO MODEL BASED ON AGGREGATION NEEDS
const characteristicsSchema = new Schema({
  id:  {
    type: Number,
    // unique: true, // To be tured back on when migrating
    default: mongoose.Types.ObjectId(), // create a new one as a stand in!
  },
  value: Number, // Average as a string (converted from string automatically)
  numFeedback: Number, //Added field
  description: String, //Added field
});

const reviewMeta = new Schema({
  product_id: {
    type: Number,
    unique: true,
  },
  ratings: {
    1: Number, //Number as a string (auto converted)
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
  recommended: {
    false: Number, //Number as a string
    true: Number,
  },
  characteristics: [characteristicsSchema], // This may go away or become an aggreated table
  results: [{
    // to be populat()ed!
    type: Schema.Types.ObjectId,
    ref: reviewModelName,
  }]
})

const reviewSchema = new Schema({
  review_id: {
    type: Number,
    unique: true,
  },
  product_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: {
    type: Date, //Date String Z format
    default: new Date(),
  },
  reviewer_name: String,
  helpfulness: Number,
  photos: [photosSchema],
  reported: Boolean, //Added feature
  characteristics: [characteristicsSchema], //Added feature
})



const ReviewMetas = mongoose.model(metaModelName, reviewMeta)
const Reviews = mongoose.model(reviewModelName, reviewSchema)

module.exports = {
  ReviewMetas,
  Reviews,
};