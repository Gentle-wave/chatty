const User = require('../models/User');

exports.getAllUsers = async () => {
    return await User.find().select('-password');
};

exports.getUserById = async (userId) => {
    return await User.findById(userId).select('-password');
};
