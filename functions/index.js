const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');

const axios = require('axios');


// const cachedResponse = require('./redis-cache');
// const cachedResponse = require('./null-cache');
const cachedResponse = require('./firebase-cache');


const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


async function fromCacheOrApi(path, cacheKey) {
  return cachedResponse(cacheKey, () => {
    const extra = path.replace("@", `/${process.env.IMDB_API_KEY}/`)
    const url = `https://imdb-api.com/en/API/${extra}`

    return axios.get(url).then(response => response.data);
  });
}

app.post('/search', async (req, res) => {
  const { searchValue } = req.body;

  const key = `search-${searchValue}`;
  const path = `SearchTitle@${searchValue}`

  res.send(await fromCacheOrApi(path, key));
});

app.get('/show/:id', async (req, res) => {
  const { id } = req.params;

  const key = `show-${id}`;
  const path = `Title@${id}`

  res.send(await fromCacheOrApi(path, key));
});

app.get('/show/:id/season/:season', async (req, res) => {
  const { id, season } = req.params;

  const key = `show-${id}-season-${season}`;

  // SeasonEpisodes/k_zmj83l1z/tt0411008/1
  const path = `SeasonEpisodes@${id}/${season}`

  res.send(await fromCacheOrApi(path, key));
});



exports.api = functions.https.onRequest(app);
