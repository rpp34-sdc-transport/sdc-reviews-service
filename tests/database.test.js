/* eslint-disable no-unused-vars */
const mongoose = require('../server/db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  ReviewIncrementer,
} = require('../server/db/schemas.js');
const axios = require('Axios');

beforeAll(() => {
  return mongoose;
})

afterAll(async () => {
  return mongoose.connection.close();
});

describe('Reviews Collection', () => {
  test('Expect Reviews to be returned by ID', async () => {
    var data = await Reviews.find({ product_id: 71719 });
    expect(data.length).toBeGreaterThan(0);
  });

  it('Expect Reviews have all required fields', async () => {
    var expectedArr = ['review_id', 'product_id', 'rating', 'summary', 'recommend',
      'response', 'body', 'date', 'reviewer_name', 'reviewer_email',
      'helpfulness', 'photos', 'reported', 'characteristics'];
    var data = await Reviews.findOne({ product_id: 71719 });
    data = (JSON.stringify(data));
    data = (JSON.parse(data));
    var keys = Object.keys(data);
    for (let field of expectedArr) {
      expect(keys).toContain(field);
    }
  });

});

describe('Reviews Meta Collection', () => {
  const productID = 71719;
  test('Expect ReviewsMeta to be returned by ID', async () => {
    try {
      var response = await axios({
        method: 'get',
        url: `http://localhost:3001/reviews/meta?product_id=${productID}`
      });
    } catch (err) {
      console.log(err.message);
      response.status = err.response.status;
      response.statusText = err.response.statusText;
    }
    var data = await Reviews.find({ product_id: productID });
    expect(data.length).toBeGreaterThan(0);
  })

  it('Expect Reviews have all required fields', async () => {

    var expectedArr = ['product_id', 'dateUpdated', 'lastReviewDate', 'ratings',
      'recommended', 'characteristics'];
    var data = await ReviewMetas.findOne({ product_id: productID });
    data = (JSON.stringify(data));
    data = (JSON.parse(data));
    var keys = Object.keys(data);
    for (let field of expectedArr) {
      expect(keys).toContain(field);
    }
  });

  it('Have required Rating fields', async () => {
    var expectedArr = ['product_id', 'dateUpdated', 'lastReviewDate', 'ratings',
      'recommended', 'characteristics'];
    var data = await ReviewMetas.findOne({ product_id: productID });
    data = data.ratings;
    for (let i = 1; i < 6; i++) {
      expect(typeof data[i]).toBe('number');
    }
  });


});

