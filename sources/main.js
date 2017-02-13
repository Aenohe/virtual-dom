var express = require('express')
var path = require('path')
var app = express()

var PORT = 3000

app.use(express.static(path.join(__dirname, '../build')))

app.listen(PORT, function() {
  console.log('Server running on port 3000')
})
