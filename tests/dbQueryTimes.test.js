const mongoose = require('../server/db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
} = require('../server/db/schemas.js');

const productMax = 1000011;
const productMin = Math.floor(productMax * 0.9);

const randProduct = () => {
  return Math.floor(Math.random() * (productMax - productMin) + productMin);
};

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
};

/**
 *
 * @param {Array} idList List of product_id's
 * @param {Functions} asyncQueryCallBack db Query function MUST RETURN: `[time, numResults]`
 * @returns `[averageTime, minTime, maxTime, [product_id, queryTime, numResults]]`
 */
const queryStats = async (idList, asyncQueryCallBack) => {
  let minTime = 10000000000000000000;
  let maxTime = -1;
  let counter = 0;
  let totalTime = 0;
  let results = [];
  for (let product_id of idList) {
    let [queryTime, numResults] = await asyncQueryCallBack(product_id);
    results.push([product_id, queryTime, numResults]);
    totalTime += queryTime;
    counter++;
    minTime = queryTime < minTime ? queryTime : minTime;
    maxTime = queryTime > maxTime ? queryTime : maxTime;
  }
  let averageTime = totalTime / counter;

  return [averageTime, minTime, maxTime, results];
};


beforeAll(() => {
  return mongoose;
});

afterAll(async () => {
  return await mongoose.connection.close();
});

//------------------------------ Product Reviews ----------------------------------//
xdescribe('Times for Review Queries based on Product ID\'s should be <50 ms', () => {
  var productList = [];
  for (let i = 0; i < 50; i++) {
    productList.push(randProduct());
  }

  test('Query Reviews for 50 product_id: Times', async () => {
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



//------------------------ Review Metas, Need Axios For Service!!! --------------------------//
const axios = require('Axios');

/**
 * Please ensure server is up and running first
 * @param {Number} product_id
 * @param {String} hostURL URL for the localhost and port. Example: http://localhost:3001
 * @returns `[queryTime, response.status, response.statusText]`
 */
const metaConstuctTime = async (product_id, hostURL = 'http://localhost:3001') => {
  let start = Date.now();
  try {
    var response = await axios({
      method: 'get',
      url: `${hostURL}/reviews/meta?product_id=${product_id}`
    });
  } catch (err) {
    console.log(err);
  }
  let time = Date.now() - start;
  return [time, response.status, response.statusText];
};

const metaQueryTime = async (product_id) => {
  let start = Date.now();
  try {
    var reviewMeta = await ReviewMetas.find({ product_id }); // THIS NEEDS TO BE AXIOS!
    // console.log('Product ID:',product_id, 'Number of reviews: ', reviewList.length);
  } catch (err) {
    console.log(err.message);
  }
  let time = Date.now() - start;
  return [time, reviewMeta.length];
};

describe('Times for ReviewMetas Tests', () => {
  var productList = [];
  for (let i = 0; i < 50; i++) {
    productList.push(randProduct());
  }

  // Resets ReviewMetas Collection
  beforeAll(async () => {
    await ReviewMetas.collection.drop();
    await ReviewMetas.init();
    return;
  });

  test('Request Server to Return ReviewMetas', async () => {
    let [averageTime, minTime, maxTime, results] = await queryStats(productList, metaConstuctTime);
    console.log(`Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime}`);
    console.log('Results: product_id / queryTime [ms] / MetaReturned \n', results);
  });


  test('Query ReviewMetas for 50 product ID Times', async () => {
    let minTime = 10000000000000000000;
    let maxTime = -1;
    let counter = 0;
    let totalTime = 0;
    let results = [];
    for (let product_id of productList) {
      let [queryTime, MetaReturned] = await metaQueryTime(product_id);
      results.push([product_id, queryTime, MetaReturned]);
      totalTime += queryTime;
      counter++;
      minTime = queryTime < minTime ? queryTime : minTime;
      maxTime = queryTime > maxTime ? queryTime : maxTime;
    }
    let averageTime = totalTime / counter;
    console.log(`Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime}`);
    console.log('Results: product_id / queryTime [ms] / MetaReturned \n', results);
    expect(averageTime).toBeLessThan(50);
  });

});