const User = require('../models/User');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

exports.registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('Email already in use.', 400);
    }
    return await User.create(userData);
};

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }
    user.password = undefined; // Remove password from response
    return user;
};
