const fs = require("fs")

const Application = require("./application")
const { logger, formatters } = require("./application/logger")
const symbolsController = require("./controllers/symbols")

const app = Application()
configureLogger(app)

app.get("/symbol/:symbol", symbolsController.latestInfo)

module.exports = app

function configureLogger(app) {
  if (process.env.NODE_ENV !== "test") {
    const logFile = process.env.LOGFILE
    const stream = logFile
      ? fs.createWriteStream(logFile, { flags: "a" })
      : process.stdout
    app.use(logger([
      formatters.url,
      formatters.date("MM/DD/YY HH:mm:ss"),
      formatters.status
    ], { stream }))
  }
}
