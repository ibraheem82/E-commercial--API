const {User} = require('../models/user.model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.post('/', async (req, res) => { 
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
                userId: user.id
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


module.exports =router;