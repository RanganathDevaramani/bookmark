const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/bookmark', { useNewUrlParser: true })
.then(function(){
    console.log('connected to db')
})
.catch(function(err){
    console.log(err)
})

module.exports = {
    mongoose
}