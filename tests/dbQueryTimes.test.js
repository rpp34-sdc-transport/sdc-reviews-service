const mongoose = require('../server/db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
} = require('../server/db/schemas.js');
const axios = require('Axios');

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

//*******************************************************************//
//                          Helper Functions                         //
//*******************************************************************//

/**
 * Please ensure server is up and running first
 * @param {Number} product_id
 * @param {String} hostURL URL for the localhost and port. Example: http://localhost:3001
 * @returns `[queryTime, response.status, response.statusText]`
 */
const metaConstuctTime = async (product_id, hostURL = 'http://localhost:3001') => {
  let start = Date.now();
  let response = {};
  try {
    response = await axios({
      method: 'get',
      url: `${hostURL}/reviews/meta?product_id=${product_id}`
    });
  } catch (err) {
    console.log(err.message);
    response.status = err.response.status;
    response.statusText = err.response.statusText;
  }
  let time = Date.now() - start;
  let result = response?.data?.ratings['1'] === undefined ? null : 'Created';
  return [time, result];
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


//*******************************************************************//
//                          TEST SUITE                               //
//*******************************************************************//

// Each Test in a Describe block runs in serial only
describe('Testing DB performance', () => {
  var productList = [];
  for (let i = 0; i < 50; i++) {
    productList.push(randProduct());
  }

  // Resets ReviewMetas Collection
  beforeAll(async () => {
    await ReviewMetas.collection.drop();
    console.log('ReviewMetas Collection dropped')
    await ReviewMetas.init();
    return;
  });

  test('Request Server to Return ReviewMetas should be < 50 ms', async () => {
    try {
      var [averageTime, minTime, maxTime, results] = await queryStats(productList, metaConstuctTime);
    } catch (err) {
      console.log(err);
    }
    console.log(
      'CONSTRUCTION TIME FOR Review Metas: Round Trip Time\n',
      `Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime}\n`,
      'Results: product_id / request [ms] / MetaReturned \n',
      results
    );
    expect(maxTime).toBeLessThan(50);
  });


  test('Query ReviewMetas by product_id\'s after creation should be < 50 ms', async () => {
    try {
      var [averageTime, minTime, maxTime, results] = await queryStats(productList, metaQueryTime);
    } catch (err) {
      console.log(err);
    }
    console.log(
      'QEURY TIME FOR Review Metas\n',
      `Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime}\n`,
      'Results: product_id / queryTime [ms] / MetaReturned \n',
      results
    );
    expect(maxTime).toBeLessThan(50);
  });

  test('Query Reviews for 50 product_id with max time < 50 ms', async () => {
    try {
      var [averageTime, minTime, maxTime, results] = await queryStats(productList, reviewQueryTime)
    } catch (err) {
      console.log(err);
    }
    console.log('REVIEWS QUERY TIME by product_id\n',
      `Average Time: ${averageTime},  Min Time: ${minTime},  Max Time: ${maxTime} \n`,
      'Results: product_id / queryTime [ms] / NumReviews \n',
      results);
    expect(maxTime).toBeLessThan(50);

  });

});