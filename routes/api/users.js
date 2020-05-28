const express = require('express')
const router= express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

//Load user model 
const User = require('../../models/User')

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req,res) => 
    res.json({message : 'Hello'})
);

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req,res) => {
    User.findOne({ email:req.body.email })
        .then(user => {
            if(user){ 
                return res.status(400).json({email: 'Email already exists'})
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    photo: req.body.photo,
                    password: req.body.password,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});


router.post('/login' , (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {

        if(!user){
            res.status(404).json({ email: 'User not found'});
        }

        // Check Password
        bcrypt.compare (password, user.password).then(isMatch => {
            if(isMatch){
                //User Matched
                const payload = { id: user.id, name: user.name }

                // Sign Token
                jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                })
            }else {
                return res.status(400).json({ password: 'Password incorrect '});
            }
        })
    })
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', {session :false}), (req,res)=>{
    res.json(req.user)
})

module.exports = router;
