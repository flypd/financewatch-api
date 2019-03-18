const Response = require("../../src/application/response")

describe("Response", () => {
  it.each(["json", "get", "set"])("should have %s method", (method) => {
    const res = new Response({})
    expect(typeof res[method]).toBe("function")
  })

  describe(".status", () => {
    it("should set status code", () => {
      const res = new Response({})

      res.status(301)

      expect(res.statusCode).toBe(301)
    })

    it("should return this for chaining", () => {
      const res = new Response({})

      const anotherRes = res.status(404)

      expect(anotherRes).toBe(res)
    })
  })

  describe(".json", () => {
    it("should set correct content-type", () => {
      const res = new Response({})

      res.json({})

      expect(res.get("Content-Type")).toBe("application/json")
    })

    it("should call end with JSON string", () => {
      const res = new Response({})
      res.end = jest.fn()

      res.json({ value: "test" })

      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ value: "test" }))
    })
  })
})
