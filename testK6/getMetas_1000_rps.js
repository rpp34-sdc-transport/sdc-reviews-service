import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    getMetas_1000_rps: {
      executor: 'constant-arrival-rate',
      duration: '1m',
      rate: 1000,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 2500,
    }
  },
};

const productMax = 1000011;
const productMin = Math.floor(productMax * 0.9);
const randProduct = () => {
  return Math.floor(Math.random() * (productMax - productMin) + productMin);
};

export default function () {
  const res = http.get(`http://localhost:3001/reviews/meta?product_id=${randProduct()}`);
  check(res, {
    'Status is 200': (r) => r.status === 200,
  });
}
