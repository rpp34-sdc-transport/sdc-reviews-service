import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    postReviews_100_rps: {
      executor: 'constant-arrival-rate',
      duration: '60s',
      rate: 300,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 2500,
    }
  },
};

var review = {
  "product_id": 2000011,
  "rating": 5,
  "summary": "K6 Test Result",
  "body": "Hopping this review is easy to do!!",
  "recommend": true,
  "name": "jake",
  "email": "22@gmail.com",
  "characteristics": { "239779": 1, "239780": 3, "239781": 5, "239782": 2 },
  "photos": ["www.fakeurl1.com", "www.fakeurl2.com", "www.fakerurl3.com", "www.fakerurl4.com"]
}

const url = "http://localhost:3001/reviews/";

export default function () {
  const res = http.post(url, JSON.stringify(review), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, {
    'Status is 201': (r) => r.status === 201,
  });
}
