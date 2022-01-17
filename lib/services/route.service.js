const { setCacheData, getCacheData } = require('./redis.service')
const { getTargets } = require('./target.service')

const ROUTE_KEY = 'Route'

async function setMaxAccepts (id, maxAcceptsPerDay, currentDay) {
  await setCacheData(`${ROUTE_KEY}:${id}:${currentDay}`, maxAcceptsPerDay)
}

async function getMaxAccepts (id, currentDay) {
  return await getCacheData(`${ROUTE_KEY}:${id}:${currentDay}`)
}

async function visitorDecisions (visitorInfo) {
  const targets = await getTargets()
  const visitTimeStamp = new Date(visitorInfo.timestamp)
  const visitHour = visitTimeStamp.getUTCHours().toString()
  const visitDay = visitTimeStamp.toDateString('iso')
  const visitState = visitorInfo.geoState
  let selectedTarget = null
  const filteredTargets = targets.filter(target => {
    if (target.accept.geoState.$in.includes(visitState) &&
      target.accept.hour.$in.includes(visitHour)) {
      return target
    }
  }).sort((element1, element2) => {
    if (parseFloat(element1.value) < parseFloat(element2.value)) return 1
    if (parseFloat(element1.value) > parseFloat(element2.value)) return -1
    return 0
  })
  for (const target of filteredTargets) {
    let maxAccepts = await getMaxAccepts(target.id, visitDay)
    if (maxAccepts) {
      if (maxAccepts > 0) {
        selectedTarget = target
        maxAccepts = maxAccepts - 1
        await setMaxAccepts(target.id, maxAccepts, visitDay)
        break
      }
    } else {
      if (target.maxAcceptsPerDay) {
        await setMaxAccepts(target.id, target.maxAcceptsPerDay - 1, visitDay)
        selectedTarget = target
        break
      }
    }
  }
  if (selectedTarget) {
    return { url: selectedTarget.url }
  } else {
    return { decision: 'reject' }
  }
}
module.exports = { visitorDecisions }
