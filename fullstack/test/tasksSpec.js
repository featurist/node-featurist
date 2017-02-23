const expect = require('chai').expect
const vineHill = require('vinehill')
const createServer = require('../server/app')
const remoteMount = require('./remoteMount')
const sworm = require('sworm');

describe('tasks', () => {
  var db
  beforeEach(async () => {
    db = sworm.db({
      driver: 'websql',
      openDatabase: global.openDatabase,
      config: { filename: 'test.db' }
    })

    await db.query(`DROP TABLE IF EXISTS tasks`)
    await db.query(`CREATE TABLE tasks (
      name varchar
    )`)
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

    const server = createServer({db: db})

    vineHill({'http://localhost': server})

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
    const task = db.model({table: 'tasks'});

    const server = createServer({db: db})

    vineHill({'http://localhost': server})

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

