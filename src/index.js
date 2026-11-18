const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const Reports = require('./Reports')
const MilX = require('./MilX')
const cors = require('cors')
const dateFilter = require('nunjucks-date-filter')

process.env.TZ = 'Europe/Zurich' 

const prefix = "/CHANGEME"

app.use(cors())

app.use(bodyParser.urlencoded({ 
    extended: true
}))

let env = nunjucks.configure(__dirname + '/views', {
    autoescape: true,
    express: app
})

env.addFilter('date', dateFilter)

app.get(prefix + '/', (req, res) => {
    res.render('index.html')
})

app.post(prefix + '/', (req, res) => {
    Reports.logReport(req.body.lat, req.body.long, req.body.callsign, "OPERATIONAL", req.body.message, req.body.ttl)
    res.redirect(prefix + '/success')
})

app.get(prefix + '/success', (req, res) => {
    res.render('success.html')
})

app.get(prefix + '/reports', (req, res) => {
    res.render('log.html', {
        logs: Reports.getReports()
    })
})

app.get(prefix + '/Layer.milxly', (req, res) => {
    const buf = Buffer.from(MilX.generateMilXFile(Reports.getNewestReports()));
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream'
    })
    res.write(buf);
    res.end()
    res.send()
})

app.get(prefix + '/map', (req, res) => {
    res.render('map.html')
})

app.listen(3000, () => {
  console.log(`Example app listening`)
})