const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        chatRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Message content cannot be empty.'],
        },
    },
    { timestamps: true }
);

messageSchema.index({ chatRoom: 1, createdAt: -1 }); // For fetching messages in a chat room

module.exports = mongoose.model('Message', messageSchema);
