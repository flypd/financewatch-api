const Response = require("./response")
const pathRegexp = require("../utils/pathRegexp")
const url = require("url")

module.exports = createApplication

function createApplication() {
  const app = new Application()
  app.use(initMiddleware)
  return app
}

function initMiddleware(req, res) {
  Object.setPrototypeOf(res, Response.prototype)
}

class Application {
  constructor() {
    function app(req, res, out) {
      return app.handle(req, res, out)
    }

    Object.setPrototypeOf(app, Application.prototype)

    this.routes = app.routes = []
    this.middleware = app.middleware = []

    return app
  }

  use(middleware) {
    this.middleware.push(middleware)
  }

  route(path, handler, method = "_all_") {
    const [regexp, keys] = pathRegexp(path)
    const route = {
      path, method, regexp, keys, matchesAll: path === "/"
    }
    this.routes.push({ route, handler })
  }

  get(path, handler) {
    this.route(path, handler, "get")
  }

  handle(req, res) {
    for (const middleware of this.middleware) {
      middleware(req, res)
    }

    req.params = req.params || {}

    for (const layer of this.routes) {
      const path = getPath(req)
      const match = matches(path, layer.route)

      if (!match || !handlesMethod(req.method, layer.route)) {
        continue
      }

      const params = processParams(match, layer.route)
      Object.assign(req.params, params)

      layer.handler(req, res)

      return
    }

    // no match
    res.status(404).end()
  }
}

function matches(path, route) {
  if (route.matchesAll) {
    return true
  }
  return route.regexp.exec(path)
}

function handlesMethod(method, route) {
  if (route.method === "_all_") {
    return true
  }
  return route.method === method.toLowerCase()
}

function getPath(req) {
  try {
    return url.parse(req.url).pathname
  } catch (err) {
    return undefined
  }
}

function processParams(match, route) {
  const params = {}

  for (let i = 1; i < match.length; i++) {
    const key = route.keys[i - 1]
    params[key.name] = match[i]
  }

  return params
}

