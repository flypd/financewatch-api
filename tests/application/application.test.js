const Application = require("../../src/application")

const noop = () => {}

describe("Application", () => {
  it("should return a function", () => {
    const app = new Application()
    expect(typeof app).toBe("function")
  })

  it.each(["use", "handle", "get"])("should have a method .%s",
    fnName => {
      const app = new Application()
      expect(typeof app[fnName]).toBe("function")
    })

  describe(".handle", () => {
    it("should dispatch", done => {
      const app = new Application()

      app.get("/foo", (req, res) => res.end())

      app.handle({ method: "GET", url: "/foo" }, { end: done })
    })
  })

  it("should support dynamic routes", done => {
    const app = new Application()

    app.get("/:foo/route/:bar", (req, res) => {
      expect(req.params).toEqual({ foo: "test", bar: "foo" })
      res.end()
    })

    app.handle({ url: "/test/route/foo", method: "GET" }, { end: done })
  })

  it(".get should not handle other requests", () => {
    const app = new Application()
    const fn = jest.fn()

    app.get("/", fn)

    app.handle({ url: "/", method: "POST" }, { end: noop })

    expect(fn).toBeCalledTimes(0)
  })

  it("should return 404 for not matching routes", () => {
    const app = Application()
    const status = jest.fn(function() {
      return this
    })

    app.handle({ url: "/foo/bar" }, { status, end: noop })

    expect(status).toHaveBeenCalledWith(404)
  })

  describe(".use", () => {

    it.each(["/", "/foo", "/bar", "baz"])(
      "should be called for any url (%s)", (url) => {
        const router = new Application()
        const fn = jest.fn()

        router.route("/", fn)

        router.handle({ url, method: "GET" }, {})

        expect(fn).toHaveBeenCalled()
      }
    )
  })
})
