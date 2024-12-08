const request = require('supertest');
const app = require('../src/index'); // Assuming the app is exported in index.js

describe('Auth Endpoints', () => {
    it('should signup a user successfully', async () => {
        const res = await request(app).post('/api/v1/auth/signup').send({
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
            dateOfBirth: '2000-01-01',
            gender: 'male',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user successfully', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
