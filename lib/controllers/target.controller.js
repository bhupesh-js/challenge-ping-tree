const { getReqData } = require('../utils')
const { targetService } = require('../services')
const { sendResponse, sendErrorResponse } = require('../interceptors/response.interceptor')

async function addTarget (req, res, opts) {
  try {
    const targetData = await getReqData(req)
    const target = await targetService.addTarget(targetData)
    sendResponse(req, res, target, 201)
  } catch (error) {
    sendErrorResponse(req, res, error.message)
  }
}

async function getAllTargets (req, res, opts) {
  try {
    const targets = await targetService.getTargets()
    sendResponse(req, res, targets, 200)
  } catch (error) {
    sendErrorResponse(req, res, error.message)
  }
}

async function getTargetById (req, res, opts) {
  try {
    const targets = await targetService.getTargetById(opts.params.id)
    sendResponse(req, res, targets, 200)
  } catch (error) {
    sendErrorResponse(req, res, error.message)
  }
}

async function updateTarget (req, res, opts) {
  try {
    const targetData = await getReqData(req)
    const targets = await targetService.updateTarget(opts.params.id, targetData)
    sendResponse(req, res, targets, 200)
  } catch (error) {
    sendErrorResponse(req, res, error.message)
  }
}

module.exports = { addTarget, getAllTargets, getTargetById, updateTarget }
