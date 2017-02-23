const expect = require('chai').expect
const vineHill = require('vinehill')
const sworm = require('sworm');
const createServer = require('../server/app')
const remoteMount = require('./remoteMount')
const migration = require('../server/migration')

describe('tasks', () => {
  var db
  beforeEach(async () => {
    db = sworm.db({
      driver: 'websql',
      openDatabase: global.openDatabase,
      config: { filename: 'test.db' }
    })

    await migration.delete(db)
    await migration.migrate(db)

    const server = createServer({db})

    vineHill({'http://localhost': server})
  })

  it('lists the tasks', async () => {
    const task = db.model({table: 'tasks'});

    await Promise.all([
      task({name: 'Initialise repo'}).save(),
      task({name: 'Add dependencies'}).save(),
      task({name: 'Write tests'}).save(),
      task({name: 'Implement features'}).save(),
      task({name: 'Release'}).save(),
    ])

    const monkey = await remoteMount('/', {})

    await monkey.find('.task').shouldHave({text: [
      'Initialise repo',
      'Add dependencies',
      'Write tests',
      'Implement features',
      'Release'
    ]})
  })

  it('creates a task', async () => {
    const monkey = await remoteMount('/', {})

    const newTask = monkey.find('.new-task')
    await newTask.find('[name=name]').typeIn('Task 1')
    await newTask.find('button').click()

    await monkey.find('.task').shouldHave({text: [
      'Task 1'
    ]})

    const results = await db.query('select * from tasks')
    expect(results).to.eql([{name: 'Task 1'}])
  })
})

