const express = require('express')
const {mongoose} = require('./config/database')
const port = 3000
const {Bookmark} = require('./app/models/bookmark')
const {bookmarkController} = require('./app/controllers/bookmarkController')
const app = express()
app.use(express.json())

app.use('/bookmarks', bookmarkController)

app.listen(port, function(){
    console.log('listening on port', port)
})