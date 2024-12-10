const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const chatSocket = (io) => {
    io.on('connection', async (socket) => {
        const { userId } = socket.handshake.query;

        if (!userId) {
            console.log('No userId provided on connection');
            socket.disconnect();
            return;
        }

        console.log(`A user connected: ${socket.id} with userId: ${userId}`);

        try {
            const userChatRooms = await Chat.find({ participants: userId }).select('_id');
            const roomIds = userChatRooms.map((room) => room._id.toString());

            roomIds.forEach((roomId) => socket.join(roomId));
            console.log(`User ${userId} joined rooms: ${roomIds}`);

            socket.emit('joinedRooms', roomIds);
        } catch (error) {
            console.error('Error joining user to rooms:', error.message);
        }

        // Send a message
        socket.on('sendMessage', async ({ chatRoomId, senderId, receiverId, content, fakeMessageId }) => {
            const message = await Message.create({
                chatRoom: chatRoomId,
                sender: senderId,
                receiver: receiverId,
                content,
            });

            await Chat.findByIdAndUpdate(chatRoomId, { lastMessage: message._id });

            console.log('message emited; ', message)
            io.to(chatRoomId).emit('newMessage', message, fakeMessageId);
        });
        // Get a chat Room
        socket.on('getRoom', async ({ user1, user2 }, callback) => {
            let chatRoom = await Chat.findOne({
                participants: { $all: [user1, user2] },
            });

            if (!chatRoom) {
                chatRoom = await Chat.create({
                    participants: [user1, user2],
                });
            }

            callback({ roomId: chatRoom._id });
        });

        // Delete a message
        socket.on('deleteMessage', async ({ messageId, chatRoomId }) => {
            try {
                const messageToDelete = await Message.findById(messageId);

                if (!messageToDelete) {
                    return console.error('Message not found.');
                }

                await Message.findByIdAndDelete(messageId);

                const chatRoom = await Chat.findById(chatRoomId);

                if (chatRoom.lastMessage && chatRoom.lastMessage.toString() === messageId) {
                    const latestMessage = await Message.findOne({ chatRoom: chatRoomId })
                        .sort({ createdAt: -1 }); // Get the next most recent message

                    await Chat.findByIdAndUpdate(chatRoomId, {
                        lastMessage: latestMessage ? latestMessage._id : null,
                    });
                }

                io.to(chatRoomId).emit('messageDeleted', messageId);
            } catch (error) {
                console.error('Error deleting message:', error.message);
            }
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
