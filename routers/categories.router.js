const {Category} = require('../models/category.model');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category)
         res.status(500).json({message: 'The category with the given ID was not found'})
// * if there is category
    res.status(200).send(category);

})

router.post('/', async (req, res) => { 
    let category = new Category({
        name: req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
// will return the categories that is created.
    category = await category.save();

    if (!category)
        return res.status(404).send('The category cannot be created!')
// * if there is category
    res.send(category)
})

// * Update Category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon || category.icon,
            color:req.body.color
        },
// new updated data will be returned
        {new : true}
    )

    if (!category)
        return res.status(404).send('The category cannot be created!')
// * if there is category
    res.send(category)
})

router.delete('/:id', (req, res) => {
    // * will find and delete by ID
    const findID = req.params.id
    Category.findByIdAndRemove(findID).then(category => {
        if (category) {
            return res.status(200).json({
                success: true,
                message: `The category with the ID ~ ${findID} ~ was deleted.`
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Category with the ID ~ ${findID} ~ not found.`
            });
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

module.exports = router;