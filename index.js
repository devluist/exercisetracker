const express = require('express')
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser');
const database = require("./database");
const controllers = require('./controllers')

const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.use('/api/users/', controllers)




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
