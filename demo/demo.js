var toolbar = require('../index.js')
toolbar('.bar-tab').on('select', function(selected) {
  console.log(selected)
})
