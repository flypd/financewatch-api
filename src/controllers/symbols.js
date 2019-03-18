const iextrading = require("../client-api/iextrading")

exports.latestInfo = latestInfo

async function latestInfo(req, res) {
  const symbol = req.params.symbol

  try {
    const latestStockPrice = await iextrading.latestStockPrice(symbol)
    const logoUrl = await iextrading.logoUrl(symbol)
    const [latestNews] = await iextrading.latestNews(symbol, 1)

    return res.status(200).json({
      latestStockPrice,
      logoUrl,
      latestNews
    })
  } catch (e) {
    res.status(503).end("Could not fetch data")
  }

}
