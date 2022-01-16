const redis = require('redis');

const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;


async function cachedResponse(cacheKey, freshData) {
  const client = redis.createClient(REDISPORT, REDISHOST);
  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  let data = await client.get(cacheKey);

  if (!data) {
    console.log('cache miss', cacheKey)
    data = await freshData();
    await client.set(cacheKey, JSON.stringify(data));
  } else {
    console.log('cache hit', cacheKey)
  }

  return data;
}

module.exports = cachedResponse;
