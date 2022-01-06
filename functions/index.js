const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');

const axios = require('axios');
const redis = require('redis');


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.post('/', async (req, res) => {
  const { searchValue } = req.body;

  const cacheKey = `search-${searchValue}`;

  const client = redis.createClient();
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  let data = await client.get(cacheKey);
  if (!data) {
    const url = `https://imdb-api.com/en/API/SearchTitle/${process.env.IMDB_API_KEY}/${searchValue}`
    const response = await axios.get(url);
    data = response.data;
    await client.set(cacheKey, JSON.stringify(data))
  }
  res.send(data);
});


exports.search = functions.https.onRequest(app);
