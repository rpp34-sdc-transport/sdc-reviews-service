const express = require('express');
require('dotenv').config();

const router = require('./router.js');
const server = express();
const PORT = process.env.PORT || 3001;

const { exec } = require("child_process");
exec('sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3001', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: forwarding TCP port 80 to ${PORT}. ${stdout}`);
});

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

server.get('/loaderio-90e63fab73e9d8f102c56058467bea46*', (req, res) => {
  res.send('loaderio-90e63fab73e9d8f102c56058467bea46');
})

server.listen(PORT, () => {
  console.log(`Review Service Listening on ${PORT}`);
});
