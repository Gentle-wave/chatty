const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await userService.getAllUsers();
    res.status(200).json({
        status: 'success',
        data: { users },
    });
});

exports.getUserDetails = catchAsync(async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});
