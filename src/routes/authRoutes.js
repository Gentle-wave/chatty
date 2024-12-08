const express = require('express');
const { signup, login } = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { body } = require('express-validator');

const router = express.Router();

router.post(
    '/signup',
    // [
    //     body('email').isEmail().withMessage('Invalid email format.'),
    //     body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    //     body('username').notEmpty().withMessage('Username is required.'),
    // ],
    // validateRequest,
    signup
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email format.'),
        body('password').notEmpty().withMessage('Password is required.'),
    ],
    validateRequest,
    login
);

module.exports = router;
