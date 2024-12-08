const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/chatService');

exports.getUserChats = catchAsync(async (req, res, next) => {
    const chats = await chatService.getUserChatRooms(req.user.id);
    res.status(200).json({
        status: 'success',
        data: { chats },
    });
});

exports.getChatMessages = catchAsync(async (req, res, next) => {
    const messages = await chatService.getMessagesInChat(req.params.chatId);
    res.status(200).json({
        status: 'success',
        data: { messages },
    });
});
