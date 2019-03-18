const doRequest = require("../utils/request").doRequest

exports.logoUrl = logo
exports.latestStockPrice = latestStockPrice
exports.latestNews = latestNews

const API_URL = "https://api.iextrading.com/1.0"

function logo(symbol) {
  const url = `${API_URL}/stock/${symbol}/logo`
  return doRequest("GET", url)
    .then(logo => logo.url)
}

function latestStockPrice(symbol) {
  const url = `${API_URL}/stock/${symbol}/price`
  return doRequest("GET", url)
}

function latestNews(symbol, last = 1) {
  const url = `${API_URL}/stock/${symbol}/news/last/${last}`
  return doRequest("GET", url).then(extractUrls)

  function extractUrls(news) {
    return news.map(piece => piece.url)
  }
}
