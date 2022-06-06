require('./db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
} = require('./db/schemas.js');

//---------------------- Helper Functions --------------------//

/**
 * Parses the id to a Number type and determine valid input
 * @param {string} id as a string
 * @returns id as a `number` or `false` if the id is invalid
 */
const idParser = (id) => {
  if (id.length === 0) {
    return false;
  }
  var parsed = Number(id);
  console.log('parsed id:', parsed)
  if (isNaN(parsed) || parsed === 0) {
    return false;
  }
  return parseInt(id, 10);
}

/**
 * Simply send and logs erros from db queries
 * @param {errObject} err
 * @param {requestObject} res
 */
const serverErr = (err, res) => {
  console.log(err);
  res.status(500);
  res.send(err.message);
}

/**
 * Complies ReviewMeta from an array of reviews
 * @param {Number} product_id array of reviews sorted by newest
 * @returns `ReviewMeta`
 */
const compileReviews = async (product_id) => {
  let promises = [
    Reviews.find({ product_id }).sort({ 'date': -1 }),
    CharDescs.find({ product_id }).select({ _id: 0, product_id: 0 })
  ]
  try {
    let [reviewsPromise, charDescriptionPromise] = await Promise.allSettled(promises);
    if (reviewsPromise.status !== 'fulfilled' || charDescriptionPromise.status !== 'fulfilled') {
      throw 'Something can\'t be found';
    }
    var reviews = reviewsPromise.value;
    var charDescription = charDescriptionPromise.value;
    console.log(reviews, charDescription);
  } catch (err) {
    return err;
  }


  // let reviews = await Reviews.find({ product_id }).sort({ 'date': -1 });
  // console.log('Meta Reivews List:', reviews);

  var result = {
    product_id: product_id,
    lastReviewDate: reviews[0].date,
    recommended: {
      false: 0,
      true: 0,
    },
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    characteristics: {},
  };

  for (let review of reviews) {
    result.recommended[review.recommended]++;
    result.ratings[review.rating]++;
    for (let character of review.characteristics) {
      if (result.characteristics[character.characteristic_id] === undefined) {
        result.characteristics[character.characteristic_id] = [character.value];
      } else {
        result.characteristics[character.characteristic_id].push(character.value);
      }
    }
  }
  var characteristics_ids = Object.keys(result.characteristics);
  console.log('Result Obj: ', result);
  console.log('CharIDs to look up', characteristics_ids);


  return result;
}

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
    response.results = await Reviews.find({ product_id })
      .limit(count).sort(sortOptions[sort]).select(excludeFeilds);
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

  }

  try {
    var result = await ReviewMetas.findOne({ product_id });
  } catch (err) {
    serverErr(err, res);
  }
  console.log('ReviewMeta data:', result)
  // IF No results, then need to compile the results


  if (result === null || result?.dateUpdated < result?.lastReviewDate) {
    // Conditions that require a recompile
    try {
      // crunch the list!!
      result = await compileReviews(product_id);

      res.status(200);
      res.send('OK');
    } catch (err) {
      serverErr(err, res);
    }
  } else {
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
  // Set _id to id field.or generate a date number.... for new ids
  // also need to update metas if exists!!
  res.status(200);
  res.send('OK');
}

const putHelpfulReview = async (req, res) => {
  var review_id = idParser(req.params.review_id);
  console.log('review_id:', review_id);

  if (review_id === false) {
    res.status(422)
    res.send('Error: invalid review_id provided')
    return;
  }

  res.status(204);
  res.send('OK');
}

const putReportReview = async (req, res) => {
  var review_id = idParser(req.params.review_id);
  console.log('review_id:', review_id);

  if (review_id === false) {
    res.status(422)
    res.send('Error: invalid review_id provided')
    return;
  }

  res.status(204);
  res.send('OK');
}

module.exports = {
  getReviews,
  getReviewMeta,
  postReview,
  putHelpfulReview,
  putReportReview,
}