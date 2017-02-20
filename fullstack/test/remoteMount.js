const http = require('httpism')
const hyperdom = require('hyperdom')
const createMonkey = require('browser-monkey/create')
const window = require('global')
const App = require('../browser/app')

module.exports = function mount (url, model) {
  return new Promise(resolve => {
    http.get(url).then(response => {
      var container = window.document.createElement('div')
      container.innerHTML = response.body
      window.document.body.appendChild(container)
      resolve(createMonkey(container))
    })
  }).then(monkey => {
    hyperdom.append(monkey._selector, new App(model), undefined, {
      requestRender: setTimeout
    })
    return monkey
  })
}
