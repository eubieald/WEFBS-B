// functions/server.js

const express = require('express');
const server = express();

server.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Netlify Function!' });
});

module.exports.handler = server;
