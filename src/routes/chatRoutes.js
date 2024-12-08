const express = require('express');
const { getUserChats, getChatMessages } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUserChats); // Get all chat rooms for the logged-in user
router.get('/:chatId', getChatMessages); // Get all messages in a specific chat room

module.exports = router;
