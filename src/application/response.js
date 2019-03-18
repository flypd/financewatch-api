const http = require("http")

class Response extends http.ServerResponse {
  status(code) {
    this.statusCode = code
    return this
  }

  json(obj) {
    if (!this.get("Content-Type")) {
      this.set("Content-Type", "application/json")
    }
    const body = JSON.stringify(obj)
    return this.end(body)
  }
}

Response.prototype.get = Response.prototype.getHeader
Response.prototype.set = Response.prototype.setHeader

module.exports = Response
