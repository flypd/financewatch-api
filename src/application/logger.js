const formatters = logger.formatters = {}

module.exports.logger = logger
module.exports.formatters = formatters

function logger(formatters, options = {}) {
  const stream = options.stream || process.stdout

  return function loggerMiddleware(req, res) {
    res.on("finish", logRequest)

    function logRequest() {
      const line = formatLine(req, res)
      stream.write(`${line}\n`)
    }
  }

  function formatLine(req, res) {
    return formatters
      .map(formatter => formatter(req, res))
      .join(" ")
  }
}

logger.addFormatter = function addFormatter(name, fn) {
  formatters[name] = fn
  return this
}

logger.addFormatter("url", function getUrl(req) {
  return req.url
})

logger.addFormatter("status", function responseStatus(req, res) {
  return res.statusCode < 400 ? "SUCCESS" : "FAIL"
})

logger.addFormatter("date", function date(format) {
  const date = new Date()

  return function requestDate() {
    return formatDate(date, format)
  }

  function formatDate(date, format) {
    const o = {
      M: date.getMonth() + 1,
      D: date.getDate(),
      H: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    }

    return format
      .replace(/(M+|D+|H+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + o[v.slice(-1)]).slice(-2)
      })
      .replace(/(Y+)/g, function(v) {
        return date.getFullYear().toString().slice(-v.length)
      })
  }
})
