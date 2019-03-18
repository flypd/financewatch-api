const iextrading = require("../../src/client-api/iextrading")

jest.mock("../../src/utils/request")
const doRequest = require("../../src/utils/request").doRequest

describe("IEX Trading API Client", () => {
  describe("logo", () => {
    test("should return symbol logo url", async () => {
      doRequest.mockResolvedValue(
        { url: "https://storage.googleapis.com/iex/api/logos/AAPL.png" })

      const logoUrl = await iextrading.logoUrl("aapl")
      expect(logoUrl).toBe(
        "https://storage.googleapis.com/iex/api/logos/AAPL.png"
      )
    })
  })

  describe("latestStockPrice", () => {
    test("should return a single number", async () => {
      doRequest.mockResolvedValue(100)

      const price = await iextrading.latestStockPrice("aapl")
      expect(typeof price).toBe("number")
    })
  })

  describe("LatestNews", () => {
    test("should return a link to latest news article", async () => {
      doRequest.mockResolvedValue([
        { url: "https://api.iextrading.com/1.0/stock/aapl/article/6265970450565561" }
      ])

      const [newsLink] = await iextrading.latestNews("aapl")
      expect(typeof newsLink).toBe("string")
      expect(newsLink)
        .toBe(
          "https://api.iextrading.com/1.0/stock/aapl/article/6265970450565561")
    })
  })
})
