const express = require('express');
const { getAllUsers, getUserDetails } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllUsers); // Get a list of all users
router.get('/me', getUserDetails); // Get details of the logged-in user

module.exports = router;
