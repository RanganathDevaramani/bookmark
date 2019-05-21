const express = require('express')
const router = express.Router()
const { User} = require('../models/user')
const { authenticateUser } = require('../middlewares/authenticate')

router.get('/userList', function(req, res){
    User.find()
        .then(function(user) {
            res.send(user)
        })
        .catch(function(err){
            res.send(err)
        })
})
//localhost:3005/users/register
router.post('/register', function(req, res){
    const {username, email, password} = req.body

    if( !username && !email && !password ){
       res.send({message : 'Please enter all fields'})
    }
    if (username.length < 5 ){
        res.send({ message : "Username must be at least 5 character"})
    }
    
    if (password.length < 6) {
       res.send({ message : 'Password must be at least 6 characters' })
    }
    else{
        const user = new User({
            username,
            email,
            password
        })
        User.countDocuments({}, function(err, count) {
            if(count == 0) {
                user.role = 'Admin'
            }
        })
        user.save()
            .then(function(user){
                res.send(user)
            })
            .catch(function(err){
                res.send(err)
            })
    }

})

//localhost:3005/users/login
router.post('/login', function(req, res){
    const body = req.body
    User.findByCredentials(body.email, body.password)
        .then(function(user){
            return user.generateToken()    //return Promise object
            })
            .then(function(user){
            res.send(user)
            })
            .catch(function(err){
                res.status(404).send(err)
            })
})

router.get('/account', authenticateUser, function(req, res){
    const {user} = req
    res.send ({
        _id : user.id, 
        username : user.username,
        email : user.email,
    })
})


router.delete('/logout', authenticateUser, function(req, res){
    const { user, token} = req
    User.findByIdAndUpdate(user._id, { $pull : { tokens : {token : token }}})
        .then(function(){
            res.send('Successfully logged out')
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports = {
    usersController : router
}