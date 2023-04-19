const { User } = require('../models/user.model');
const catchAsync = require('../helpers/catchAsync');



exports.getAllUsers = catchAsync(async (req, res, next) => {
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