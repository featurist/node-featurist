var vdom = require('virtual-dom')
var http = require('httpism')
var hyperx = require('hyperx')
var hyperdom = require('hyperdom');
var hx = hyperx(hyperdom.html)

module.exports = class App {
  constructor() {
    this.tasks = []
    this.newTask = {}
  }

  onload() {
    return http.get('/tasks').then(response => {
      this.tasks = response.body
    })
  }

  addTask() {
    return http.post('/tasks', this.newTask).then(response => {
      this.tasks = response.body
    })
  }

  render() {
    const model = this.newTask
    return hx`<div>
      <ul>
      ${
        this.tasks.map(task => hx`<li class="task">${task.name}</li>`)
      }</ul>
      <div class="new-task">
        <input name="name" binding=${[model, 'name']} />
        <button onclick=${() => this.addTask()}>Add task</button>
      </div>
    </div>`
  }
}
