const EventEmitter = require("events").EventEmitter

const { logger, formatters } = require("../../src/application/logger")

describe("logger", () => {
  let req, res, stream

  function mockDate(dt) {
    const datetime = new Date(dt)
    global.Date = class extends Date {
      constructor() {
        super()
        return datetime
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    req = { url: "/" }
    res = new EventEmitter()
    stream = { write: jest.fn() }

    global._Date = Date
  })

  afterEach(() => {
    jest.clearAllMocks()
    global.Date = global._Date
  })

  it("should return a function", () => {
    const log = logger([], { stream })
    expect(typeof log).toBe("function")
  })

  it("should write to stream on response finish", () => {
    const log = logger([], { stream })

    log(req, res)
    res.emit("finish")

    expect(stream.write).toHaveBeenCalled()
  })

  describe("formatter", () => {
    describe("url", () => {
      it("should log request url", () => {
        req.url = "/test/path"
        const log = logger([formatters.url], { stream })

        log(req, res)
        res.emit("finish")

        expect(stream.write).toHaveBeenCalledWith("/test/path\n")
      })
    })

    describe("responseStatus", () => {
      it.each([200, 301])("should log SUCCESS if status code is %s",
        (code) => {
          res.statusCode = code
          const log = logger([formatters.status], { stream })

          log(req, res)
          res.emit("finish")

          expect(stream.write).toBeCalledWith("SUCCESS\n")
        })

      it.each([404, 500])("should log FAIL if status code is %s",
        (code) => {
          res.statusCode = code
          const log = logger([formatters.status], { stream })

          log(req, res)
          res.emit("finish")

          expect(stream.write).toBeCalledWith("FAIL\n")
        })
    })

    describe("date", () => {
      it.each([
        ["DD", "2019-01-02", "02\n"],
        ["MM", "2019-07-02", "07\n"],
        ["YY", "2019-03-04", "19\n"],
        ["YYYY", "2019-04-05", "2019\n"],
        ["HH", "2019-03-10T13:01:02", "13\n"],
        ["mm", "2019-03-10T14:02:03", "02\n"],
        ["ss", "2019-03-10T15:03:04", "04\n"]
      ])("should support %s format", (fmt, dt, expected) => {
        mockDate(dt)
        const log = logger([formatters.date(fmt)], { stream })

        log(req, res)
        res.emit("finish")

        expect(stream.write).toBeCalledWith(expected)
      })
      it("should log formatted date", () => {
        mockDate("2019-03-10T13:00:05")
        const log = logger([formatters.date("MM/DD/YY HH:mm:ss")], { stream })

        log(req, res)
        res.emit("finish")

        expect(stream.write).toBeCalledWith("03/10/19 13:00:05\n")
      })
    })

  })
})
