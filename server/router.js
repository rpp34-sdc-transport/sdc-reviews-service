/* eslint-disable no-unused-vars */
const router = require('express').Router();
const {
  getReviews,
  getReviewMeta,
  postReview,
  putHelpfulReview,
  putReportReview,
} = require('./dbFetcher.js');

//------------------------- ROUTES ----------------------------------//
router.get('/', getReviews);

router.get('/meta', getReviewMeta);

router.post('/', postReview);

router.put('/:review_id/helpful', putHelpfulReview);

router.put('/:review_id/report',putReportReview);

module.exports = router;