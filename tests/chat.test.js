const request = require('supertest');
const app = require('../src/index');

describe('Chat Endpoints', () => {
    it('should fetch user chats', async () => {
        const token = 'mocked-token'; // Replace with a valid token
        const res = await request(app)
            .get('/api/v1/chats')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('chats');
    });
});
