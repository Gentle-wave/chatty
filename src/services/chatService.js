const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getUserChatRooms = async (userId) => {
    return await Chat.find({ participants: userId })
        .populate('participants', '_id username profilePicture') // Populate participant details
        .populate({
            path: 'lastMessage',
            select: 'content createdAt',
        });
};


exports.getMessagesInChat = async (chatId) => {
    return await Message.find({ chatRoom: chatId }).sort('createdAt');
};
