const hyperdom = require('hyperdom')
const App = require('./app')

window.addEventListener('load', () => {
  hyperdom.append(document.body, new App())
})
