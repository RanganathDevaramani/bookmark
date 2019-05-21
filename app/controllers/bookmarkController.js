const express = require('express')
const router = express.Router()
var useragent = require('useragent')
const {Bookmark} = require('../models/bookmark')
const { authenticateUser } = require('../middlewares/authenticate')

router.get('/', authenticateUser, (req, res) => {
    Bookmark.find()
        .then(bookmark => {
            res.send(bookmark)
        })
        .catch(err => {
            res.send(err)
        })
})

router.get('/tags', authenticateUser, (req,res) => {
    let a = req.query.names.split(',')
    Bookmark.find({tags: {"$in": [a[0], a[1]]}})
        .then(bookmark => {
            res.send(bookmark)
        })
        .catch(err => {
            res.send(err)
        })
})


router.get ('/:hash', authenticateUser, (req, res) => {
    const hash = req.params.hash
    var agent = useragent.parse(req.headers['user-agent'])
    const clicked = {
        created : new Date(),
        ip: String(req.connection.remoteAddress),
        browser: agent.toAgent(),
        os : agent.os.toString(),
        device:agent.device.toVersion()
    }
    console.log(clicked)
    Bookmark.findOneAndUpdate({hashedUrl : hash}, {$push : {click : clicked}}, {new : true, runValidators: true})
        .then(bookmark => {
        res.redirect(bookmark.originalUrl)
        })
        .catch(err => {
            res.send(err)
        })
   })

router.post('/', authenticateUser, (req, res) => {
    const body = req.body
    const bookmark = new Bookmark(body)
    bookmark.save()
        .then(bookmark => {
            res.send(bookmark)
        })
        .catch(err => {
            res.send(err)
        })
})


router.get('/:id', authenticateUser, (req,res) => {
    const id = req.params.id
    Bookmark.findById(id)
        .then(bookmark => {
            if(bookmark){
                res.send(bookmark)
            }else { 
                res.send({})
            }
        })
        .catch(function(err){
            res.send(err)
        })
})

router.put('/:id', authenticateUser, (req, res) => {
    const id = req.params.id
    const body = req.body
    Bookmark.findByIdAndUpdate(id, {$set : body}, {new : true , runValidators: true})
        .then(bookmark => {
            res.send(bookmark)
        })
        .catch(err => {
            res.send(err)
        })
})

router.delete('/:id', authenticateUser,(req, res) => {
    const id = req.params.id
    Bookmark.findByIdAndDelete(id)
        .then(bookmark => {
            res.send(bookmark)
        })
        .catch(err => {
            res.send(err)
        })
})

router.get('/tags/:name', authenticateUser, (req, res) => {
    const name = req.params.name
    Bookmark.find({ tags: name})
        .then(bookmark =>{
            res.send(bookmark)
        })
        .catch(err => {
            res.send(err)
        })
})



module.exports = {
    bookmarkController : router
}