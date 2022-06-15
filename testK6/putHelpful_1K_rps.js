import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    putHelpful_1K_rps: {
      executor: 'constant-arrival-rate',
      duration: '1m',
      rate: 1000,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 1000,
    }
  },
};

const reviewMax = 5774952;
const reviewMin = Math.floor(reviewMax * 0.9);
const randReview = () => {
  return Math.floor(Math.random() * (reviewMax - reviewMin) + reviewMin);
};

export default function () {
  const res = http.put(`http://localhost:3001/reviews/${randReview()}/helpful`);
  check(res, {
    'Status is 204': (r) => r.status === 204,
  });
}