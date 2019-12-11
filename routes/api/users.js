const express = require('express')
const router= express.Router()

const User = require('../../models/User')

router.get('/test', (req,res) => 
    res.json({message : 'Hello'})
);

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
                newUser.save(function(err, resp) {
                    if (err) {
                      console.log(err);
                      res.send({
                        message: 'something went wrong'
                      });
                    } else {
                      user => res.json(user);
                    }
                
                  });
            }
        })
});


module.exports = router;