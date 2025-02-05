import express from 'express';
import request from 'supertest';
import fetch from 'node-fetch';

// Mock fetch
jest.mock('node-fetch');

const app = express();
app.set("view engine", 'ejs');

// Setup routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', async (req, res) => {
    try {
        if (!req.query.person) {
            return res.status(400).json({ error: 'Person query is required' });
        }

        const params = new URLSearchParams({
            action: "opensearch",
            search: req.query.person,
            limit: "1",
            namespace: "0",
            format: "json"
        });

        const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
        const data = await response.json();

        if (!data[3] || data[3].length === 0) {
            return res.status(404).json({ error: 'Person not found' });
        }

        res.json({ url: data[3][0], title: data[1][0], description: data[2][0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

describe('Wikipedia Search App Tests', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('Home Page', () => {
        test('GET / should return the home page', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
        });
    });

    describe('Search Endpoint', () => {
        test('GET /index without query parameter should return 400', async () => {
            const response = await request(app).get('/index');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Person query is required' });
        });

        test('GET /index should return results for valid search', async () => {
            fetch.mockImplementationOnce(() => 
                Promise.resolve({
                    json: () => Promise.resolve([
                        "Einstein",
                        ["Albert Einstein"],
                        ["German physicist"],
                        ["https://en.wikipedia.org/wiki/Albert_Einstein"]
                    ])
                })
            );

            const response = await request(app)
                .get('/index')
                .query({ person: 'Einstein' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                url: "https://en.wikipedia.org/wiki/Albert_Einstein",
                title: "Albert Einstein",
                description: "German physicist"
            });
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        test('GET /index should handle no results', async () => {
            fetch.mockImplementationOnce(() => 
                Promise.resolve({
                    json: () => Promise.resolve([
                        "NonExistentPerson",
                        [],
                        [],
                        []
                    ])
                })
            );

            const response = await request(app)
                .get('/index')
                .query({ person: 'NonExistentPerson' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Person not found' });
        });

        test('GET /index should handle API errors', async () => {
            fetch.mockImplementationOnce(() => 
                Promise.reject(new Error('API Error'))
            );

            const response = await request(app)
                .get('/index')
                .query({ person: 'Einstein' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });
});