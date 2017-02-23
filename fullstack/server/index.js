const sworm = require('sworm')
const createServer = require('./app')
const migrate = require('./migration').migrate
const port = process.env.PORT || 3000
const db = sworm.db({
  driver: 'sqlite',
  config: { filename: 'test.db' }
})

migrate(db).then(() => {
  createServer({db}).listen(port, function () {
    console.log(`Listening on port ${port}`)
  })
})
