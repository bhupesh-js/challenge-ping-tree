process.env.NODE_ENV = 'test'

var test = require('ava')
var servertest = require('servertest')
var { requestedTarget, expectedTargetResponse } = require('./mockData')
var server = require('../lib/server')

test.serial.cb('healthcheck', function (t) {
  var url = '/health'
  servertest(server(), url, { encoding: 'json' }, function (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.is(res.body.status, 'OK', 'status is ok')
    t.end()
  })
})

test.serial.cb('GET Targets - no targets', function (t) {
  var url = 'api/targets'
  var options = { encoding: 'json', method: 'GET' }

  servertest(server(), url, options, function (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.is(res.body.data.length, 0, 'no targets')
    t.end()
  })
})

test.serial.cb('POST Create target - first target', function (t) {
  var url = '/api/targets'
  var options = { encoding: 'json', method: 'POST' }
  var newTarget = requestedTarget[0]

  var expected = {
    status: 'success',
    data: expectedTargetResponse[0]
  }

  servertest(server(), url, options, onResponse)
    .end(JSON.stringify(newTarget))

  function onResponse (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 201, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values matched')
    t.end()
  }
})

test.serial.cb('POST Create target - second target', function (t) {
  var url = '/api/targets'
  var options = { encoding: 'json', method: 'POST' }
  var newTarget = requestedTarget[1]
  var expected = {
    status: 'success',
    data: expectedTargetResponse[1]
  }

  servertest(server(), url, options, onResponse)
    .end(JSON.stringify(newTarget))

  function onResponse (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 201, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values matched')
    t.end()
  }
})

test.serial.cb('GET Targets - two targets', function (t) {
  var url = 'api/targets'
  var options = { encoding: 'json', method: 'GET' }

  var expected = {
    status: 'success',
    data: expectedTargetResponse
  }
  servertest(server(), url, options, function (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values matched')
    t.end()
  })
})

test.serial.cb('GET target - target present', function (t) {
  var url = '/api/target/1'
  var options = { encoding: 'json', method: 'GET' }

  var expected = {
    status: 'success',
    data: expectedTargetResponse[0]
  }

  servertest(server(), url, options, function (err, res) {
    t.falsy(err, 'no error')
    t.is(res.statusCode, 200, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values should match')
    t.end()
  })
})

test.serial.cb('GET target - target not present', function (t) {
  var url = '/api/target/5'
  var options = { encoding: 'json', method: 'GET' }

  var expected = {
    status: 'error',
    message: 'Target not found'
  }

  servertest(server(), url, options, function (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 400, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values should match')
    t.end()
  })
})

test.serial.cb('POST Update target - target present', function (t) {
  var url = '/api/target/1'
  var options = { encoding: 'json', method: 'POST' }
  var updatedTarget = {
    url: 'http://ikea.com',
    value: '50',
    maxAcceptsPerDay: '20',
    accept: {
      geoState: {
        $in: [
          'ca',
          'or'
        ]
      },
      hour: {
        $in: [
          '13',
          '14',
          '15'
        ]
      }
    }
  }

  var expected = {
    status: 'success',
    data: { id: '1', ...updatedTarget }
  }

  servertest(server(), url, options, onResponse)
    .end(JSON.stringify(updatedTarget))

  function onResponse (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values should match')
    t.end()
  }
})

test.serial.cb('POST Update target - target not present', function (t) {
  var url = '/api/target/5'
  var options = { encoding: 'json', method: 'POST' }

  var updatedTarget = {
    url: 'http://ikea.com',
    value: '3.40',
    maxAcceptsPerDay: '20',
    accept: {
      geoState: {
        $in: [
          'ca',
          'or'
        ]
      },
      hour: {
        $in: [
          '12',
          '13',
          '14'
        ]
      }
    }
  }
  var expected = {
    status: 'error',
    message: 'Target not found'
  }

  servertest(server(), url, options, onResponse)
    .end(JSON.stringify(updatedTarget))

  function onResponse (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 400, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values should match')
    t.end()
  }
})

test.serial.cb('POST Route - request accepted ', function (t) {
  var url = '/route'
  var options = { encoding: 'json', method: 'POST' }

  var expected = {
    status: 'success',
    data: { url: 'http://ikea.com' }
  }
  var visitor = {
    geoState: 'ca',
    publisher: 'abc',
    timestamp: '2020-08-21T15:28:59.513Z'
  }

  servertest(server(), url, options, onResponse)
    .end(JSON.stringify(visitor))

  function onResponse (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values should match')
    t.end()
  }
})

test.serial.cb('POST Route - request rejected ', function (t) {
  var url = '/route'
  var options = { encoding: 'json', method: 'POST' }

  var expected = {
    status: 'success',
    data: { decision: 'reject' }
  }
  var visitor = {
    geoState: 'ui',
    publisher: 'abc',
    timestamp: '2020-08-21T15:28:59.513Z'
  }

  servertest(server(), url, options, onResponse)
    .end(JSON.stringify(visitor))

  function onResponse (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.deepEqual(res.body, expected, 'values should match')
    t.end()
  }
})
