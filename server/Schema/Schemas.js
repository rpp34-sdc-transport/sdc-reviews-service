const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewModelName = 'Reviews';
const metaModelName = 'ReviewMetas';

const photosSchema = new Schema({
  id: Number,
  url: String, //valid URL
});

const characteristicsSchema = new Schema({
  id:  {
    type: Number,
    unique: true,
  },
  value: String, // Average as a string
  numFeedback: Number, //Added field
  description: String, //Added field
});

const reviewMeta = new Schema({
  product_id: {
    type: String, //String of Product ID
    unique: true,
  },
  ratings: {
    1: String, //Number as a string
    2: String,
    3: String,
    4: String,
    5: String,
  },
  recommended: {
    false: String, //Number as a string
    true: String,
  },
  characteristics: [characteristicsSchema],
  results: [{
    // to be populat()ed!
    type: Schema.Types.ObjectId,
    ref: reviewModelName,
  }],
})

const reviewSchema = new Schema({
  review_id: {
    type: Number,
    unique: true,
  },
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: String, //Date String Z format
  reviewer_name: String,
  helpfulness: Number,
  photos: [photosSchema],
})



const ReviewMetas = mongoose.model(metaModelName, reviewMeta)
const Reviews = mongoose.model(reviewModelName, reviewSchema)

module.exports = {
  ReviewMetas,
  Reviews,
};