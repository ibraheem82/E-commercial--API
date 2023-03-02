const {User} = require('../models/user.model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get(`/`, async (req, res) =>{
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})


router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
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
        return res.status(404).send('The user cannot be created!')
// * 
    res.send(user)
})

module.exports =router;