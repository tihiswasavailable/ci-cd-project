import express from 'express';
import request from 'supertest';

const app = express();
app.set("view engine", 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

describe('Basic Tests', () => {
    test('Server is running', () => {
        expect(true).toBe(true);
    });

    test('GET / responds', async () => {
        const response = await request(app).get('/');
        expect(response.status).not.toBe(404);
    });
});