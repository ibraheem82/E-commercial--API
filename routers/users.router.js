const {User} = require('../models/user.model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// TODO: Provide your token before accessing this route.
router.get(`/`, async (req, res) =>{
    // const userList = await User.find();
    // ! Excluding the -> [passwordHash] field.
    const userList = await User.find().select('-passwordHash');

    // Selecting a specific fields you want to use.
    // const userList = await User.find().select('name email phone');

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})


router.get('/:id', async (req, res) => {
    // const user = await User.findById(req.params.id);
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user)
         res.status(500).json({message: 'The user with the given ID was not found'})
// * if there is user
    res.status(200).send(user);

})

// * Register User
router.post('/', async (req, res) => { 
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).send('User with this e-mail already exists ✉');
        }

        const phoneExists = await User.findOne({ phone: req.body.phone });
        if (phoneExists) {
            return res.status(400).send('User with this phone number already exists 📱');
        }
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
//
    user = await user.save();

    if (!user)
        return res.status(404).send('The user cannot be created!❌')
// * 
    res.send(user)
})


// * Login User
// * when you logIn you will be given a access {Token}.
router.post('/login', async (req, res) => {
    // login with the credentials that will be provided.
    const user = await User.findOne({
        email: req.body.email
    })
    const secret = process.env.secret

    if (!user) {
        return res.status(400).send('The user not found❌');
    }
// it will compare the password that the user is useing to sign in by the user.passwordHash in the database.
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {

        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {
                expiresIn: '200d'
            }
        )
        // res.status(200).send('User Authenticated✅');
        // the token get the user will be use to login
        // the token was created by the "secret"
        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('Wrong password❌');
    }
})

// * Delete User
router.delete('/:id', (req, res) => {
    // * will find and delete by ID
    const findID = req.params.id
    User.findByIdAndRemove(findID).then(user => {
        if (user) {
            return res.status(200).json({
                success: true,
                message: `The user with the ID ~ ${findID} ~ was deleted.`
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `User with the ID ~ ${findID} ~ not found.`
            });
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})


router.get(`/get/count`, async(req, res) => {
  // It will return the product count.
//   const userCount = await User.countDocuments((count) => count)
    const userCount = await User.countDocuments({});
    
  if (!userCount) {
    res.status(500).json({success:false})
  }
  res.send({
    userCount:userCount
  });
})

module.exports =router;