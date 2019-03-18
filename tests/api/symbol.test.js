const request = require("supertest")
const app = require("../../src/app")

jest.mock("../../src/client-api/iextrading")
const iextrading = require("../../src/client-api/iextrading")

describe("Stock ticker symbol endpoint", () => {
  beforeEach(() => {
    iextrading.logoUrl.mockReturnValue("")
    iextrading.latestNews.mockReturnValue(["http://some.url/"])
    iextrading.latestStockPrice.mockReturnValue(100)
  })

  it("should return 200 on GET", async () => {
    const response = await request(app).get("/symbol/aapl")
    expect(response.statusCode).toBe(200)
  })

  it("response should be json", async () => {
    const response = await request(app).get("/symbol/aapl")
    expect(response.type).toBe("application/json")
  })

  it.each(["latestStockPrice", "logoUrl", "latestNews"])(
    "response should contain: %s",
    async prop => {
      const response = await request(app)
        .get("/symbol/aapl")
        .then(response => JSON.parse(response.text))

      expect(response).toHaveProperty(prop)
    }
  )
})
