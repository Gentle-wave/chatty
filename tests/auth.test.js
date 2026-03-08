const request = require('supertest');
const app = require('../src/index');

// Mock the authService to avoid database operations
jest.mock('../src/services/authService', () => ({
    registerUser: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
    }),
    authenticateUser: jest.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
    }),
}));

// Mock jwt to avoid requiring JWT_SECRET env var
jest.mock('../src/utils/jwt', () => ({
    generateToken: jest.fn().mockReturnValue('test-jwt-token'),
}));

describe('Auth Endpoints', () => {
    it('should signup a user successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
                dateOfBirth: '2000-01-01',
                gender: 'male',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.status).toEqual('success');
    });

    it('should login a user successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.status).toEqual('success');
    });

    it('should return 400 for invalid signup data', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                email: 'invalid-email',
                username: 'testuser',
            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
});
