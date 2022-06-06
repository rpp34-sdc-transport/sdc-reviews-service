/* eslint-disable no-unused-vars */
const express = require('express')
const server = express()
require('./db/db.js');
require('dotenv').config();
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
} = require('./db/schemas.js');

const PORT = process.env.PORT || 3000;

server.get('/', (req, res) => {
  res.send('Hello Word, welcome to review service!');
})

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});
