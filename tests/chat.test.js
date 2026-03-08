const request = require('supertest');
const app = require('../src/index');

// Mock the authMiddleware to bypass authentication
jest.mock('../src/middlewares/authMiddleware', () => {
    return (req, res, next) => {
        req.user = {
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
        };
        next();
    };
});

// Mock the chatService to avoid database operations
jest.mock('../src/services/chatService', () => ({
    getUserChatRooms: jest.fn().mockResolvedValue([
        {
            _id: '507f1f77bcf86cd799439012',
            name: 'Test Chat',
            members: ['507f1f77bcf86cd799439011'],
        },
    ]),
    getMessagesInChat: jest.fn().mockResolvedValue([
        {
            _id: '507f1f77bcf86cd799439013',
            chatId: '507f1f77bcf86cd799439012',
            content: 'Test message',
        },
    ]),
}));

describe('Chat Endpoints', () => {
    it('should fetch user chats', async () => {
        const token = 'mocked-token';
        const res = await request(app)
            .get('/api/v1/chat')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.data).toBeDefined();
    });

    it('should return chat messages for a specific chat', async () => {
        const token = 'mocked-token';
        const chatId = '507f1f77bcf86cd799439012';
        const res = await request(app)
            .get(`/api/v1/chat/${chatId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('success');
    });
});
