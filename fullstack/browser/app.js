var vdom = require('virtual-dom')
var http = require('httpism')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)

module.exports = class App {
  constructor() {
    this.tasks = []
  }

  onload() {
    return http.get('/tasks').then(response => {
      this.tasks = response.body
    })
  }

  render() {
    return hx`<div>${
      this.tasks.map(task => hx`<span class="task">${task.name}</span>`)
    }</div>`
  }
}
