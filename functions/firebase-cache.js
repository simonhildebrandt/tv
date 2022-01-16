const admin = require('firebase-admin');

admin.initializeApp();

module.exports = async function cachedResponse(cacheKey, freshData) {

  const cacheDocs = await admin
    .firestore()
    .collection('cache')
    .where('cacheKey', '==', cacheKey)
    .limit(1)
    .get();

  if (cacheDocs.size == 0) {
    console.log('cache miss for', cacheKey);
    const data = await freshData();
    const createdAt = new Date().valueOf();

    await admin
      .firestore()
      .collection('cache')
      .add({data, cacheKey, createdAt});

    return data;
  } else {
    console.log('cache hit for', cacheKey);
    return cacheDocs.docs[0].data().data;
  }
}
