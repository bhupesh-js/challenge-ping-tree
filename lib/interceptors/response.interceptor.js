var sendJson = require('send-data/json')

function sendResponse (req, res, data, statusCode) {
  res.statusCode = statusCode
  sendJson(req, res, {
    status: 'success',
    data: data
  })
}

function sendErrorResponse (req, res, message, statusCode) {
  res.statusCode = statusCode || 400
  sendJson(req, res, {
    status: 'error',
    message: message
  })
}
module.exports = { sendResponse, sendErrorResponse }
