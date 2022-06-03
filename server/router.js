/* eslint-disable no-unused-vars */
const router = require('express').Router();
require('./db/db.js');
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
} = require('./db/schemas.js');

var idParser = (id) => {
  var parsed = Number(id) ;
  if (isNaN(parsed)) {
    return false;
  }
  return parseInt(id, 10);
}

//ROUTES

router.get('/', (req, res) => {
  // Default Constants
  const defaultCount = 5;
  const defaultSort = 'helpful';
  const sortOptions = {
    'helpful': true,
    'newest': true,
    'relevant': true
  }

  // Checking for Valid Parameters
  var count = req.query.count > 0 ? req.query.count : defaultCount;
  var sort = sortOptions[req.query.sort] ? req.query.sort : defaultSort;
  var product_id = idParser(req.query.product_id);

  // test for valid product_id which is key
  console.log('product_id:', product_id);
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

  res.status(200);
  res.send(response);
});

router.get('/meta', (req, res) => {
  var product_id = idParser(req.query.product_id);
  if (product_id === false) {
    res.status(422)
    res.send('Error: invalid product_id provided')
    return;
  }

  res.status(200);
  res.send('OK');
});

router.post('/', (req, res) => {
  var product_id = idParser(req.body.product_id);
  if (product_id === false) {
    res.status(422)
    res.send('Error: invalid product_id provided')
    return;
  }

  res.status(200);
  res.send('OK');
});

router.put('/:review_id/helpful', (req, res) => {
  var review_id = idParser(req.params.review_id);
  console.log('review_id:', review_id);

  if (review_id === false) {
    res.status(422)
    res.send('Error: invalid review_id provided')
    return;
  }

  res.status(204);
  res.send('OK');
});

router.put('/:review_id/report', (req, res) => {
  var review_id = idParser(req.params.review_id);
  console.log('review_id:', review_id);

  if (review_id === false) {
    res.status(422)
    res.send('Error: invalid review_id provided')
    return;
  }

  res.status(204);
  res.send('OK');
});


module.exports = router;