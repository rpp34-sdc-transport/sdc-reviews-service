require('./db/db.js');
const mongoose = require('mongoose');
const {
  ReviewMetas,
  Reviews,
} = require('./db/schemas.postELT.js');

const {
  idParser,
  serverErr,
  compileReviews,
  parseReview,
} = require('./dbControllerUtils.js');

//------------------- Mongoose Functions -----------------//

const getReviews = async (req, res) => {
  // Default Constants
  const defaultCount = 5;
  const defaultSort = 'helpful';
  const sortOptions = {
    'helpful': { 'helpfulness': -1 },
    'newest': { 'date': -1 },
    'relevant': { 'helpfulness': -1 }
  }
  const excludeFeilds = {
    'reported': 0,
    'characteristics': 0,
    "__v": 0,
    'photos._id': 0,
  }

  // Checking for Valid Parameters
  var count = req.query.count > 0 ? req.query.count : defaultCount;
  var sort = sortOptions[req.query.sort] !== undefined ? req.query.sort : defaultSort;
  var product_id = idParser(req.query.product_id);

  // test for valid product_id which is key
  if (product_id === false) {
    res.status(422)
    res.send('Error: invalid product_id provided')
    return;
  }

  var response = {
    product: product_id,
    page: 0,
    count: count,
    results: []
  }

  try {
    var results = await Reviews.find({ product_id, reported: { $ne: true } })
      .sort(sortOptions[sort]).limit(count).select(excludeFeilds).lean();
    for (let i = 0; i < results.length; i++) {
      results[i].review_id = results[i]._id.toString();
    }
    response.results = results;
    res.status(200);
    res.send(response);
  } catch (err) {
    serverErr(err, res);
  }
}

const getReviewMeta = async (req, res) => {
  var product_id = idParser(req.query.product_id);
  if (product_id === false) {
    res.status(422)
    res.send('Error: invalid product_id provided')
    return;
  }

  const excludeFeilds = {
    '_id': 0,
    '__v': 0,
  }

  var empty = {
    product_id: product_id,
    ratings: {},
    recommended: {},
    characteristics: {}
  };

  try {
    var result = await ReviewMetas.findOne({ product_id }).select(excludeFeilds);
  } catch (err) {
    serverErr(err, res);
  }
  // console.log('ReviewMeta data:', result)
  // IF No results, then need to compile the results
  if (result === null || result?.dateUpdated < result?.lastReviewDate) {
    // Conditions that require a recompile
    // console.log('Review Meta Needs to be compiled.');

    try {
      result = await compileReviews(product_id);
      // console.log('Compiled results:', result);
      res.status(200);
      res.send(result);
    } catch (err) {
      //Results not found, send empty Data
      res.status(200);
      res.send(empty);
    }
  } else {
    // console.log('Review Meta Found');
    res.status(200);
    res.send(result);
  }
}

const postReview = async (req, res) => {
  var product_id = idParser(req.body.product_id);
  if (product_id === false) {
    res.status(422)
    res.send('Error: invalid product_id provided')
    return;
  }

  // Parse the review for validation:
  // console.log('Review Preview', req.body)
  var parsedReview = parseReview(req.body);
  if (parsedReview === false) {
    serverErr({ message: 'Invalid Body In review' }, res, 422);
    return;
  }
  try {

    // Creating review, but also updating Meta lasteReviewedDate
    await Promise.all([Reviews.create(parsedReview), ReviewMetas.updateOne({ product_id }, { $set: { lastReviewDate: new Date() } }) ])
    // var newReview = await Reviews.create(parsedReview);
    // console.log('Posted Review', newReview);

    res.status(201);
    res.send('Created'); // apparently the frontEnd is looking for this to check a review is submitted successfully


  } catch (err) {
    serverErr(err, res);
  }

}

const putHelpfulReview = async (req, res) => {
  var review_id = req.params.review_id;
  // console.log('review_id:', review_id);

  try {
    // eslint-disable-next-line no-unused-vars
    await Reviews.updateOne({ _id: mongoose.Types.ObjectId(review_id) }, { $inc: { helpfulness: 1 } });
    // console.log('Helpfulness: ', review.helpfulness);
    res.status(204);
    res.send('OK');
  } catch (err) {
    serverErr(err, res);
  }
}

const putReportReview = async (req, res) => {
  var review_id = req.params.review_id;

  try {
    // eslint-disable-next-line no-unused-vars
    await Reviews.updateOne({ _id: mongoose.Types.ObjectId(review_id) }, { $set: { reported: true } });
    // console.log('Reported: ', review.reported);
    res.status(204);
    res.send('OK');
  } catch (err) {
    serverErr(err, res);
  }
}

module.exports = {
  getReviews,
  getReviewMeta,
  postReview,
  putHelpfulReview,
  putReportReview,
}