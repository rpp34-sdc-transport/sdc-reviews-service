const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewModelName = 'reviews';
const metaModelName = 'review_metas';
const charDescModelName = 'characteristics_descriptions';
const reviewIncrementModelName = 'review_incrementer';


const characteristicsDescriptionSchema = new Schema({
  id: {
    type: Number,
    index: true,
  },
  product_id: {
    type: Number,
    required: true,
    index: true,
  },
  name: String,
});

const postELTCharSchema = new Schema({
  characteristic_id: {
    type: Number,
    required: true,
  },
  value: Number,
  description: String, //This is purely here for the meta! posted reviews will not have this value.
});

const postELTPhotosSchema = new Schema({
  id: {
    type: Number,
    default: Math.floor(Math.random() * new Date().getTime()),
  },
  url: String,
});

const reviewMetaSchema = new Schema({
  product_id: {
    type: Number,
    index: true,
    unique: true,
  },
  dateUpdated: {
    type: Date,
    default: new Date(),
  },
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
  characteristics: {}, //for compilation of the Meta, description needs to be looked up via ID...

});

const reviewSchema = new Schema({
  review_id: {
    type: Number,
    index: true,
    required: true,
  },
  product_id: {
    type: Number,
    index: true,
    required: true,
  },
  rating: Number,
  summary: String,
  recommend: {
    type: Boolean,
    default: true
  },
  response: String,
  body: String,
  date: {
    type: Date,
    default: new Date()
  },
  reviewer_name: String,
  reviewer_email: String,
  helpfulness: Number,
  photos: [postELTPhotosSchema],
  reported: {
    type: Boolean,
    default: false,
  },
  characteristics: [postELTCharSchema],
});

const reviewIncrementerSchema = new Schema({
  review_id: Number
}, { capped: { size: 4096, max: 1 } });

const ReviewMetas = mongoose.model(metaModelName, reviewMetaSchema, metaModelName);
const Reviews = mongoose.model(reviewModelName, reviewSchema, reviewModelName);
const CharDescs = mongoose.model(charDescModelName, characteristicsDescriptionSchema, charDescModelName);
const ReviewIncrementer = mongoose.model(reviewIncrementModelName, reviewIncrementerSchema, reviewIncrementModelName);

module.exports = {
  ReviewMetas,
  Reviews,
  CharDescs,
  ReviewIncrementer,
};
