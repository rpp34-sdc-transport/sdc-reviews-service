/* eslint-disable no-unused-vars */

const mongoose = require('../server/db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs
} = require('../server/db/schemas.js');

beforeAll(() => {
  return mongoose;
})


afterAll(async () => {
  await mongoose.connection.close();
  return;
});

describe('Reviews Collection Should Exist', () => {
  test('Expect Reviews to be returned by ID', async () => {
    var data = await Reviews.find({ product_id: 71719 });
    expect(data.length).toBeGreaterThan(0);
  })

  it('Expect Reviews have all required fields', async () => {
    var expectedArr = ['id', 'product_id', 'rating', 'summary', 'recommend',
      'response', 'body', 'date', 'reviewer_name', 'reviewer_email',
      'helpfulness', 'photos', 'reported', 'characteristics'];
    var data = await Reviews.findOne({ product_id: 71719 });
    data = (JSON.stringify(data));
    data = (JSON.parse(data));
    var keys = Object.keys(data);
    for (let field of expectedArr) {
      expect(keys).toContain(field);
    }
  })

});
