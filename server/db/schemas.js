const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewModelName = 'Reviews';
const metaModelName = 'ReviewMetas';

const photosSchema = new Schema({
  id: Number,
  url: String,
});

const characteristicsSchema = new Schema({
  id:  { //This is going to NOT be needed, but an id is still needed due to FEC requiremnts.
    type: Number,
    // unique: true, // To be tured back on when migrating
    default: mongoose.Types.ObjectId(),
  },
  value: Number,
  description: String, //Added field for new schema
});

const reviewMeta = new Schema({
  product_id: {
    type: Number,
    unique: true,
  },
  dateUpdated: Date,
  lastReviewDate: Date,

  /***
   * The Below are going to be updated intermittenly when
   * `lastReviewDate` exceeds `dateUpdated`by X min when reading data.
   */
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
  recommended: {
    false: Number,
    true: Number,
  },
  characteristics: [characteristicsSchema],

  //WILL GO AWAY DURING ETL
  results: [{
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
    type: Date,
    default: new Date(),
  },
  reviewer_name: String,
  helpfulness: Number,
  photos: [photosSchema],
  reported: Boolean,
  characteristics: [characteristicsSchema],
})



const ReviewMetas = mongoose.model(metaModelName, reviewMeta)
const Reviews = mongoose.model(reviewModelName, reviewSchema)

module.exports = {
  ReviewMetas,
  Reviews,
};