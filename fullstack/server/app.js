const path = require('path')
const express = require('express')
const browserify = require('browserify-middleware')
const sworm = require('sworm')

module.exports = (config) => {
  const app = express()
  app.get('/', (req, res) => {
    res.send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Featurist TODO</title>
          <script src="/app.js"></script>
        </head>
        <body>
        </body>
      </html>
      `)
  })

  app.get('/tasks', (req, res) => {
    config.db.query('select * from tasks').then(results => {
      res.send(results)
    })
  })

  app.get('/app.js', browserify(path.join(__dirname, '/../browser/index.js'), {
    fullPaths: true
  }))
  
  return app
}
