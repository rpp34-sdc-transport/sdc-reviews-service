const express = require('express');
require('dotenv').config();

const router = require('./router.js');
const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({extended: true}));

/**
 * Logs Basic request queries
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
 // eslint-disable-next-line no-unused-vars
 const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (Object.keys(req.params).length > 0) {
    console.log('Request Params:', req.params);
  }
  if (Object.keys(req.query).length > 0) {
    console.log('Request Query:', req.query);
  }
  if (Object.keys(req.body).length > 0){
    console.log('Request Body:', req.body);
  }
  next();
};

// server.use(logger)
server.use('/reviews', router)
server.get('/', (req, res) => {
  res.send('Hello Word, welcome to review service!');
});

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});
