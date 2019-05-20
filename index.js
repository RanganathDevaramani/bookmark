const express = require('express')
const {mongoose} = require('./config/database')
const port = 3000
const {bookmarkController} = require('./app/controllers/bookmarkController')
const { usersController } = require('./app/controllers/userController')
const app = express()
app.use(express.json())

app.use('/bookmarks', bookmarkController)
app.use('/users', usersController)

app.listen(port, function(){
    console.log('listening on port', port)
})