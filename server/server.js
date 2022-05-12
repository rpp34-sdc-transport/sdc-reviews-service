require('dotenv').config()
const express = require('express');
const server = express();

const PORT = process.env.PORT || 3000;

server.get('/', (req, res) => {
  res.send('Hello Word!');
})

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});

