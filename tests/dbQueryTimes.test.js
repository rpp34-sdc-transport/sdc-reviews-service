const mongoose = require('../server/db/db.js');
const {
  ReviewMetas,
  Reviews,
} = require('../server/db/schemas.js');

const productMax = 1000011;
const productMin = Math.floor(productMax * 0.9)
const reviewMax = 5774952;
const reviewMin = Math.floor(reviewMax * 0.9)

const randProduct = () => {
  return Math.floor(Math.random() * (productMax - productMin) + productMin);
}

// const randReview = () => {
//   return Math.random() * (reviewMax - reviewMin) + reviewMin;
// }

const reviewQueryTime = async (product_id) => {
  let start = Date.now();
  try {
    var reviewList = await Reviews.find({ product_id });
    // console.log('Product ID:',product_id, 'Number of reviews: ', reviewList.length);
  } catch (err) {
    console.log(err.message);
  }
  let time = Date.now() - start;
  return [time, reviewList.length];
}

const metaQueryTime = async (product_id) => {
  let start = Date.now();
  try {
    var reviewMeta = await ReviewMetas.find({ product_id });
    // console.log('Product ID:',product_id, 'Number of reviews: ', reviewList.length);
  } catch (err) {
    console.log(err.message);
  }
  let time = Date.now() - start;
  return [time];
}

beforeAll(() => {
  return mongoose;
})

afterAll(async () => {
  return await mongoose.connection.close();
});

//------------------------------ Product Reviews ----------------------------------//
describe('Times for Review Queries based on Product ID\'s should be <50 ms', () => {
  var productList = [];
  for (let i = 0; i < 100; i++) {
    productList.push(randProduct());
  }
  test('Query 1000 product ID Times', async () => {
    let minTime = 10000000000000000000;
    let maxTime = -1;
    let counter = 0;
    let totalTime = 0;
    let results = [];
    for (let product_id of productList) {
      let [queryTime, numReviews] = await reviewQueryTime(product_id);
      results.push([product_id, queryTime, numReviews]);
      totalTime += queryTime;
      counter++;
      minTime = queryTime < minTime ? queryTime : minTime;
      maxTime = queryTime > maxTime ? queryTime : maxTime;
    }
    let averageTime = totalTime / counter;
    console.log(`Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime}`);
    console.log('Results: product_id / queryTime [ms] / NumReviews \n', results);
    expect(averageTime).toBeLessThan(50);
  });

});

describe('Times for ReviewMeta Queries based on Product ID\'s should be <50 ms', () => {
  var productList = [];
  for (let i = 0; i < 100; i++) {
    productList.push(randProduct());
  }
  test('Query 1000 product ID Times', async () => {
    let minTime = 10000000000000000000;
    let maxTime = -1;
    let counter = 0;
    let totalTime = 0;
    let results = [];
    for (let product_id of productList) {
      let [queryTime] = await reviewQueryTime(product_id);
      results.push([product_id, queryTime]);
      totalTime += queryTime;
      counter++;
      minTime = queryTime < minTime ? queryTime : minTime;
      maxTime = queryTime > maxTime ? queryTime : maxTime;
    }
    let averageTime = totalTime / counter;
    console.log(`Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime}`);
    console.log('Results: product_id / queryTime [ms] / NumReviews \n', results);
    expect(averageTime).toBeLessThan(50);
  });

});