const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewMeta = new Schema({
  product: String, //String of Product ID
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
    ref: 'Reviews', // THis must be the model name, not the schema name
  }],
})

const reviewSchema = new Schema({
  review_id: Number,
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

const photosSchema = new Schema({
  id: Number,
  url: String, //valid URL
});

const characteristicsSchema = new Schema({
  id: Number,
  value: Number,
  numFeedback: Number,
  description: String,
});

const ProductMeta = mongoose.model('ReviewMeta', reviewMeta)
const Reviews = mongoose.model('Reviews', reviewSchema)

module.exports = {
  ProductMeta,
  Reviews,
};