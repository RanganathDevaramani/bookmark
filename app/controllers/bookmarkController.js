const express = require('express')
const router = express.Router()
var useragent = require('useragent')
const {Bookmark} = require('../models/bookmark')

router.get('/', function(req, res){
    Bookmark.find()
    .then(function(bookmark){
        res.send(bookmark)
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/tags',function(req,res){
    let a = req.query.names.split(',')
    Bookmark.find({tags: {"$in": [a[0], a[1]]}})
        .then(function(bookmark){
            res.send(bookmark)
        })
        .catch(function(err){
            res.send(err)
        })
})


router.get ('/:hash', function(req, res){
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
    .then(function(bookmark){
       res.redirect(bookmark.originalUrl)
    })
    .catch(function(err){
        res.send(err)
    })
   })

router.post('/', function(req, res){
    const body = req.body
    const bookmark = new Bookmark(body)
    bookmark.save()
    .then(function(bookmark){
        res.send(bookmark)
    })
    .catch(function(err){
        res.send(err)
    })
})


router.get('/:id', function(req,res){
    const id = req.params.id
    Bookmark.findById(id)
    .then(function(bookmark){
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

router.put('/:id', function(req, res){
    const id = req.params.id
    const body = req.body
    Bookmark.findByIdAndUpdate(id, {$set : body}, {new : true , runValidators: true})
    .then(function(bookmark){
        res.send(bookmark)
    })
    .catch(function(err){
        res.send(err)
    })
})

router.delete('/:id', function(req, res){
    const id = req.params.id
    Bookmark.findByIdAndDelete(id)
    .then(function(bookmark){
        res.send(bookmark)
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/tags/:name', function(req, res){
    const name = req.params.name
    Bookmark.find({ tags: name})
    .then(function(bookmark){
        res.send(bookmark)
    })
    .catch(function(err){
        res.send(err)
    })
})



module.exports = {
    bookmarkController : router
}