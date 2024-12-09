const express = require('express');
const { getUserChats, getChatMessages, chatRoom } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUserChats); 
router.get('/:chatId', getChatMessages); 

module.exports = router;
