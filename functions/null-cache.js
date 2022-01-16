module.exports = function cachedResponse(cacheKey, freshData) {
  console.log('no caching for', cacheKey);
  return freshData();
}
