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

// Mock the userService to avoid database operations
jest.mock('../src/services/userService', () => ({
    getAllUsers: jest.fn().mockResolvedValue([
        {
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            username: 'testuser',
        },
    ]),
    getUserById: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
    }),
}));

describe('User Endpoints', () => {
    it('should fetch all users', async () => {
        const token = 'mocked-token';
        const res = await request(app)
            .get('/api/v1/user/')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
    });

    it('should fetch logged-in user details', async () => {
        const token = 'mocked-token';
        const res = await request(app)
            .get('/api/v1/user/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
    });
});
