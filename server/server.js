/* eslint-disable no-unused-vars */
const express = require('express');
require('./db/db.js');
require('dotenv').config();
const {
  ReviewMetas,
  Reviews,
  CharDescs,
  Photos,
  Characters,
} = require('./db/schemas.js');
const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({extended: true}));

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
}

server.get('/', (req, res) => {
  res.send('Hello Word, welcome to review service!');
});


server.get('/reviews/', (req, res)=>{

  res.send('Review Data!')
});


server.get('/reviews/meta', );
server.get('/reviews/:product_id', );
server.put('/reviews/:review_id/helpful', );
server.put('/reviews/:review_id/report', );
server.post('/reviews/', );

server.use(logger)

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});
