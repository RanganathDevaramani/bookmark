const mongoose = require('mongoose')
const validator = require('validator')
const sh = require('shorthash')

const Schema = mongoose.Schema

const bookmarkSchema = new Schema({
    title : {
        type : String,
        required : true,
        minlength : 5
    },
    originalUrl : {
        type : String,
        required : true,
        validate : function(value){
            return validator.isURL(value)
        },
        message : function(){
            return 'invalid URL'
        }
    },
    tags : {
        type : [String],
        required : true
    },
    hashedUrl : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    click: [{
        // clicked: {
        //     type: Date,
        //     required: true
        // },
        // ip: {
        //     type: String,
        //     required: true
        // },
        // browser: {
        //     type: String,
        //     required: true
        // },
        // os: {
        //     type: String,
        //     required: true
        // },
        // device: {
        //     type: String,
        //     required: true
        // }
       created : Date,
       ip:String,
       browser:String,
       os:String,
       device:String

    }]

})

bookmarkSchema.pre('validate', function(next){
    // const bookmark = this
    // let hashedValue = sh.unique(bookmark.originalUrl)
    // bookmark.hashedUrl = hashedValue
    this.hashedUrl = sh.unique(this.originalUrl)
    next()
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)

module.exports = {
    Bookmark
}