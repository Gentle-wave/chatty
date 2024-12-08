const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Join a specific chat room
        socket.on('joinRoom', ({ chatRoomId }) => {
            socket.join(chatRoomId);
            console.log(`User joined room: ${chatRoomId}`);
        });

        // Send a message
        socket.on('sendMessage', async ({ chatRoomId, senderId, receiverId, content }) => {
            const message = await Message.create({
                chatRoom: chatRoomId,
                sender: senderId,
                receiver: receiverId,
                content,
            });

            io.to(chatRoomId).emit('newMessage', message);
        });

        // Delete a message
        socket.on('deleteMessage', async ({ messageId, chatRoomId }) => {
            await Message.findByIdAndDelete(messageId);
            io.to(chatRoomId).emit('messageDeleted', messageId);
        });

        // Check if a user is online
        socket.on('isUserOnline', async ({ userId }, callback) => {
            const user = await User.findById(userId);
            callback(user.isOnline);
        });

        // Update user status on disconnect
        socket.on('disconnect', async () => {
            console.log('A user disconnected:', socket.id);
        });
    });
};

module.exports = chatSocket;
