const {
  ReviewMetas,
  Reviews,
  CharDescs,
} = require('./db/schemas.postELT.js');

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
  // console.log('parsed id:', parsed)
  if (isNaN(parsed) || parsed === 0) {
    return false;
  }
  return parseInt(id, 10);
}

/**
 * Logs errors in the form of err.message and send status code and error back to the `res` object.
 * @param {Object} err `{message: 'Error Message'}`
 * @param {Object} res reference to the request object to send
 * @param {int} code html code default = `500`
 */
const serverErr = (err, res, code = 500) => {
  console.log(err);
  res.status(code);
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

  // Fetching Data From DB
  try {
    let [reviewsPromise, charDescriptionPromise] = await Promise.allSettled(promises);
    if (reviewsPromise.status !== 'fulfilled') {
      throw { message: 'Reviews for Meta can\'t be found!' };
    }
    if (charDescriptionPromise.status !== 'fulfilled') {
      throw { message: 'Characteristics Description for product can\'t be found!' };
    }
    var reviews = reviewsPromise.value;
    var charDescriptions = charDescriptionPromise.value;

    // Making a Look up table for ID to Description
    let tempDecription = {};
    for (let char of charDescriptions) {
      tempDecription[char.id] = char.name;
    }
    charDescriptions = tempDecription;

  } catch (err) {
    return err;
  }

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

  // Compiling data from reviews
  let tempChar = {}; // temp object prior to final transformation
  for (let review of reviews) {
    result.recommended[review.recommend]++;
    result.ratings[review.rating]++;
    for (let character of review.characteristics) {
      if (tempChar[character.characteristic_id] === undefined) {
        tempChar[character.characteristic_id] = [character.value];
      } else {
        tempChar[character.characteristic_id].push(character.value);
      }
    }
  }

  // Computing averages and formating the shape of the data
  var finalChar = {};
  for (let id in tempChar) {
    finalChar[charDescriptions[id]] = {
      id: Number(id),
      value: tempChar[id].reduce((a, b) => a + b, 0) / tempChar[id].length,
    }
  }

  result.characteristics = finalChar;
  try {
    // Technically I can return the result regardless of the save,
    // but this is for stresstesting purposes, and final code will have that
    // statment moved after the return result

    // ------------------
    await ReviewMetas.create(result);
    console.log('Review Meta Save OK!');
    // ------------------

    return result;
  } catch (err) {
    // will have to test if this error throwing will cascade all the way to the top!
    // and test if the error code is executed.
    console.log('Review Meta Save FAILED!', err.message);
    return err;
  }
}

/**
 * Checks and parses the review object. Returns the parsed Object. or `false` if check fails.
 * @param {Object} review
 * @returns `review_Object` or `false` is failed parser
 */
const parseReview = (review) => {
  //already check for product ID
  const keys = ['rating', 'summary', 'body', 'recommend', 'name', 'email', 'characteristics', 'photos'];
  for (let key of keys) {
    if (review[key] === undefined) {
      console.log('Failed Key Check: ', key);
      return false;
    }
  }
  review.rating = Number(review.rating);
  if (review.rating < 1 || review.rating > 5) {
    console.log('Failed Rating Check: ', review.rating);
    return false;
  }
  if (typeof review.recommend !== 'boolean') {
    console.log('Failed recommend Check: ', review.recommend)
    return false;
  }
  // Need Regex for email!!!!
  // if (Regex(/something/)){
  //   return false;
  // }

  // Renaming fields to match request to the Db fields
  review.reviewer_name = review.name;
  review.reviewer_email = review.email;

  if (typeof review.characteristics === 'object') {
    var characteristics = [];
    for (let id in review.characteristics) {
      let value = Number(review.characteristics[id]);
      var character = {
        characteristic_id: id,
        value
      }
      if (value < 1 || value > 5) {
        console.log('Failed Characteristics Value Check: ', value);
        return false;
      }
      characteristics.push(character);
    }
    review.characteristics = characteristics;
  } else {
    console.log('Failed Characteristics Check: ', review.characteristics);
    return false;
  }

  // Photo validation doesn't exist on the legacy Db...
  // but need to validate here due to the schema enforcement
  if (review.photos.length < 1) {
    delete review.photos;
  } else {
    let photos = [];
    for (let url of review.photos) {
      photos.push({ url });
    }
    review.photos = photos;
  }

  return review;
}

module.exports = {
  idParser,
  serverErr,
  compileReviews,
  parseReview,
}