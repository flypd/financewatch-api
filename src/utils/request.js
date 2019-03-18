const https = require("https")

exports.doRequest = doRequest
exports.requestPromise = requestPromise

function doRequest(method, url, options) {
  return requestPromise(method, url, options).then(response => {
    if (response && response.statusCode === 200) {
      return tryParseJSON(response)
    } else {
      throw response
    }
  })
}

function tryParseJSON(response) {
  const isJSON = response.headers["content-type"].indexOf(
    "application/json") !== -1
  return isJSON ? JSON.parse(response.data) : response.data
}

function requestPromise(method, url, options) {
  return new Promise((resolve, reject) => {
    const opts = Object.assign({ method }, options)
    const req = https.request(url, opts, response => {
      let data = ""
      response.on("data", chunk => {
        data += chunk
      })
      response.on("end", () => {
        response.data = data
        resolve(response)
      })
    })
    req.on("error", err => reject(err))
    req.end()
  })
}
