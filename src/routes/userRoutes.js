const express = require('express');
const { getAllUsers, getUserDetails } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllUsers); 
router.get('/me', getUserDetails);

module.exports = router;
