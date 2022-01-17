const { promisify } = require('util')
const client = require('../redis')

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

/**
 *
 * Sets Data into redis cache
 * @param {*} key
 * @param {*} data
 * @returns
 */
async function setCacheData (key, data) {
  await setAsync(key, data)
  return data
}

/**
 * Gets Data into redis cache
 *
 * @param {*} key
 * @returns data
 */
async function getCacheData (key) {
  const data = await getAsync(key)
  return data
}

module.exports = {
  setCacheData,
  getCacheData
}
