const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewModelName = 'Reviews';
const metaModelName = 'ReviewMetas';
const charDescName = 'characteristicsDescriptions';

const photosSchema = new Schema({
  id: Number,
  url: String,
});

const charactersticsDescriptionSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  description: String,
});

const characteristicsSchema = new Schema({
  id: { // this will be used for inserstion (this is the caracterstics_id)
    type: Number,
    // unique: true, // To be tured back on when migrating
    default: mongoose.Types.ObjectId(),
  },
  value: Number,
  description:String, //This is purely here for the meta! posetd reviews will not have this value.
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
  characteristics: [characteristicsSchema], //for compilation of the Meta, description needs to be looked up via ID...

})

const reviewSchema = new Schema({
  id: {
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
  reviewer_email: String,
  helpfulness: Number,
  photos: [photosSchema],
  reported: Boolean,
  characteristics: [characteristicsSchema],
})



const ReviewMetas = mongoose.model(metaModelName, reviewMeta)
const Reviews = mongoose.model(reviewModelName, reviewSchema)
const CharDescs = mongoose.model(charDescName, charactersticsDescriptionSchema)

module.exports = {
  ReviewMetas,
  Reviews,
  CharDescs,
};