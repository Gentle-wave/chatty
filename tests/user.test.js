const request = require('supertest');
const app = require('../src/index');

describe('User Endpoints', () => {
    it('should fetch all users', async () => {
        const token = 'mocked-token'; // Replace with a valid token
        const res = await request(app)
            .get('/api/v1/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('users');
    });

    it('should fetch logged-in user details', async () => {
        const token = 'mocked-token'; // Replace with a valid token
        const res = await request(app)
            .get('/api/v1/users/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('user');
    });
});
