const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const chatSocket = (io) => {
    io.on('connection', async (socket) => {
        const { userId } = socket.handshake.query; // Get userId from query parameters

        if (!userId) {
            console.log('No userId provided on connection');
            socket.disconnect();
            return;
        }

        console.log(`A user connected: ${socket.id} with userId: ${userId}`);

        try {
            // Fetch all chat rooms the user is a participant of
            const userChatRooms = await Chat.find({ participants: userId }).select('_id');
            const roomIds = userChatRooms.map((room) => room._id.toString());

            // Join the user to all their chat rooms
            roomIds.forEach((roomId) => socket.join(roomId));
            console.log(`User ${userId} joined rooms: ${roomIds}`);

            // Notify the frontend that the user has joined the rooms
            socket.emit('joinedRooms', roomIds);
        } catch (error) {
            console.error('Error joining user to rooms:', error.message);
        }

        // Join a specific chat room
        // socket.on('joinRoom', ({ chatRoomId }) => {
        //     socket.join(chatRoomId);
        //     console.log(`User joined room: ${chatRoomId}`);
        // });

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
