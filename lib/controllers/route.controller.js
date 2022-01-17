const { routeService } = require('../services')
const { getReqData } = require('../utils')
const { sendResponse } = require('../interceptors/response.interceptor')

async function visiterRouteDecision (req, res, opts) {
  const targetData = await getReqData(req)
  const routeDesision = await routeService.visitorDecisions(targetData)
  sendResponse(req, res, routeDesision, 200)
}

module.exports = { visiterRouteDecision }
