require('./db/db.js');
const {
  ReviewMetas,
  Reviews,
  ReviewIncrementer,
} = require('./db/schemas.postELT.js');

const {
  idParser,
  serverErr,
  compileReviews,
  parseReview,
} = require('./deFetchHelpers.js');

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
    '_id': 0,
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
    response.results = await Reviews.find({ product_id, reported: false })
      .sort(sortOptions[sort]).limit(count).select(excludeFeilds);
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
    "__v": 0,
  }

  try {
    var result = await ReviewMetas.findOne({ product_id }).select(excludeFeilds);
  } catch (err) {
    serverErr(err, res);
  }
  // console.log('ReviewMeta data:', result)
  // IF No results, then need to compile the results
  if (result === null || result?.dateUpdated < result?.lastReviewDate) {
    // Conditions that require a recompile
    console.log('Review Meta Needs to be compiled.');
    try {
      result = await compileReviews(product_id);
      res.status(200);
      res.send(result);
    } catch (err) {
      serverErr(err, res);
    }
  } else {
    console.log('Review Meta Found');
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
    var { review_id } = await ReviewIncrementer.findOneAndUpdate({}, { $inc: { review_id: 1 } });
    parsedReview.review_id = review_id;
    var newReview = await Reviews.create(parsedReview);

    // also need to update metas if exists!!
    // The Below lines of code (4 lines) needs to be moved after sending the status.
    // Since updating the Review Metas is not critical to returing the request.

    // ------------------
    var status = await ReviewMetas.findOneAndUpdate({ product_id }, { lastReviewDate: newReview.date });
    if (status === null) {
      console.log('ReviewMeta was not compiled for this Product');
    }
    // ------------------

    res.status(200);
    res.send('OK');
  } catch (err) {
    serverErr(err, res);
  }

}

const putHelpfulReview = async (req, res) => {
  var review_id = idParser(req.params.review_id);
  console.log('review_id:', review_id);

  if (review_id === false) {
    res.status(422)
    res.send('Error: invalid review_id provided')
    return;
  }
  try {
    let review = await Reviews.findOneAndUpdate({ review_id }, { $inc: { helpfulness: 1 } }, { new: true });
    console.log('Helpfulness: ', review.helpfulness);
    res.status(204);
    res.send('OK');
  } catch (err) {
    serverErr(err, res);
  }
}

const putReportReview = async (req, res) => {
  var review_id = idParser(req.params.review_id);
  console.log('review_id:', review_id);

  if (review_id === false) {
    res.status(422)
    res.send('Error: invalid review_id provided')
    return;
  }
  try {
    let review = await Reviews.findOneAndUpdate({ review_id }, { reported: true }, { new: true });
    console.log('Reported: ', review.reported);
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