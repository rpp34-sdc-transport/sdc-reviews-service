const express = require('express')
const server = express()
require('./db.js');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

server.get('/', (req, res) => {
  res.send('Hello Word, welcome to review service!');
})

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});



