const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.getUserChatRooms = async (userId) => {
    const chatRooms = await Chat.find({ participants: userId })
        .populate('participants', '_id username profilePicture') // Populate participant details
        .populate({
            path: 'lastMessage',
            select: 'content createdAt',
        });

    // Transform the data into the desired format
    return chatRooms.map((chat) => {
        // Find the participant that is not the current user
        const otherParticipant = chat.participants.find(
            (participant) => participant._id.toString() !== userId.toString()
        );

        return {
            roomId: chat._id,
            username: otherParticipant?.username || 'Unknown',
            profilePicture: otherParticipant?.profilePicture || null,
            userId: otherParticipant?._id || null,
            message: chat.lastMessage?.content || '',
            time: chat.lastMessage?.createdAt?.toISOString() || '',
        };
    });
};



exports.getMessagesInChat = async (chatId) => {
    return await Message.find({ chatRoom: chatId }).sort('createdAt');
};
