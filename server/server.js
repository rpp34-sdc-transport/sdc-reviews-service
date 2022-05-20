const express = require('express')
const server = express()
require('./db/db.js');
require('dotenv').config();
const PORT = process.env.PORT || 3000;




server.get('/', (req, res) => {
  res.send('Hello Word, welcome to review service!');
})

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});

/*

const parseMeta = (charObj) => {
  var characteristics = [];
  for (let key in charObj) {
    characteristics.push({
      ...charObj[key],
      description: key,
    })
  }
  return characteristics;
}

//-------------- TEST TO BE MOVED TO JEST TESTS--------------//

const { ReviewMetas, Reviews } = require('./db/schemas.js');
const testReviews = require('../legacyAPI_examples/reviews.example.js')
const testMeta = require('../legacyAPI_examples/reviewMeta.example.js')
const characteristics = parseMeta(testMeta.characteristics);
testMeta.characteristics = characteristics;

// Sets up the object propperly in the DB

test();
async function test() {
  try {
    await Reviews.collection.drop();
    await Reviews.init();
    const reviews = await Reviews.insertMany(testReviews.results);
    // console.log(reviews);
    // INSERTION OK!

    // Here we can used the now populated _id for the meta!
    var reviewKeys =[];
    for (let review of reviews) {
      reviewKeys.push(review._id);
    }
    testMeta.results = reviewKeys;
    // console.log(testMeta);
    // DATA PROCESSED OK!

    await ReviewMetas.collection.drop();
    await ReviewMetas.init();
    const reviewMeta = await ReviewMetas.insertMany([testMeta]);
    console.log(reviewMeta);
    // INSERTION OK!

    const result = await ReviewMetas.find({product_id: "71719"}).populate('results');
    console.log(result);
    result[0].results.forEach((review)=>{
      console.log(review);
    })
    console.log(result[0].characteristics);
    // POPULATE ON QUERY OK!

  } catch (e) {
    console.log(e);
  }
}

*/
