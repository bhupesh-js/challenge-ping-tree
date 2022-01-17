const { setCacheData, getCacheData } = require('./redis.service')

const TARGET_KEY = 'Target'

async function addTarget (target) {
  const targets = JSON.parse(await getCacheData(TARGET_KEY))
  const tempTarget = target
  if (targets) {
    const id = targets.length + 1
    tempTarget.id = id
    targets.push(tempTarget)
    await setCacheData(TARGET_KEY, JSON.stringify(targets))
  } else {
    tempTarget.id = 1
    const tempTargetArray = [tempTarget]
    await setCacheData(TARGET_KEY, JSON.stringify(tempTargetArray))
  }

  return tempTarget
}

async function getTargets () {
  const targets = JSON.parse(await getCacheData(TARGET_KEY))
  return targets || []
}

async function getTargetById (id) {
  const targets = JSON.parse(await getCacheData(TARGET_KEY))
  if (targets && targets.length) {
    const target = targets.filter(target => target.id === parseInt(id))
    if (target.length) {
      return target.shift()
    }
  }
  throw new Error('Target not found')
}

async function updateTarget (id, updatedTarget) {
  const targets = JSON.parse(await getCacheData(TARGET_KEY))
  if (targets && targets.length) {
    const tempTarget = updatedTarget
    tempTarget.id = id
    var filterTarget = targets.filter(target => target.id === Number(id))
    if (filterTarget.length) {
      var updatedTargets = targets.map(filterTarget => {
        if (filterTarget.id === Number(id)) {
          filterTarget = tempTarget
        }

        return filterTarget
      })
      await setCacheData(TARGET_KEY, JSON.stringify(updatedTargets))
      return tempTarget
    }
  }
  throw new Error('Target not found')
}

module.exports = { addTarget, getTargets, getTargetById, updateTarget, TARGET_KEY }
