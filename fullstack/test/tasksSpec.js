const vineHill = require('vinehill')
const createServer = require('../server/app')
const remoteMount = require('./remoteMount')
const sworm = require('sworm');

describe('tasks', () => {
  it('lists the tasks', async () => {
    const db = sworm.db({
      driver: 'websql',
      config: {filename: 'test.db'}
    })

    await db.query(`CREATE TABLE tasks (
      name varchar
    )`)
    const task = db.model({table: 'tasks'});
    console.log('created')

    await Promise.all([
      task({name: 'Initialise repo'}).save(),
      task({name: 'Add dependencies'}).save(),
      task({name: 'Write tests'}).save(),
      task({name: 'Implement features'}).save(),
      task({name: 'Release'}).save(),
    ])

    const server = createServer({db: db})

    vineHill({'http://localhost': server})

    const monkey = await remoteMount('/', {})

    await monkey.find('.task').shouldHave({text: [
      'Initialise repo',
      'Add dependencies',
      'Writes tests',
      'Implement features',
      'Release'
    ]})
  })
})

