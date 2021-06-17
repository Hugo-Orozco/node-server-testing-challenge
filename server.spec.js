const db = require('./data/db-config');
const server = require('./api/server');
const request = require('supertest');

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async () => {
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});

describe('GET /', () => {

    it('Sanity Test', () => {
        expect(true).not.toBe(false);
    });

    it('process.env.DB_ENV = testing', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });

    it('Get Valid Recipe (200)', () => {
        return request(server).get('/api/recipes/1')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '356')
            .then(res => {
                const { body } = res;
                expect(body.recipe_id).toBe(1);
                expect(body.recipe_name).toBe('Spaghetti Bolognese');
                expect(body.steps).toHaveLength(2);
            });
    });

    it('Get Invalid Recipe (404)', () => {
        return request(server).get('/api/recipes/2')
            .expect(404)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '81')
            .then(res => {
                const { body } = res;
                expect(body).toHaveProperty('custom', 'Internal Server Error');
                expect(body).toHaveProperty('message', 'Recipe with recipe_id 2 not found.');
                expect(body.custom).toMatch(/Internal Server Error/i);
                expect(body.message).toMatch(/Recipe with recipe_id 2 not found./i);
            });
    });

    it('Post Valid Recipe (201)', () => {
        return request(server).post('/api/recipes')
            .send({ recipe_name: 'Valid Recipe' })
            .expect(201)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '167')
            .then(res => {
                const { body } = res;
                expect(body.recipe_id).toBe(2);
                expect(body.recipe_name).toBe('Valid Recipe');
            });
    });

    it('Post Invalid Recipe (400)', () => {
        return request(server).post('/api/recipes')
            .send({ invalid_recipe_name: 'Invalid Recipe' })
            .expect(400)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '66')
            .then(res => {
                const { body } = res;
                expect(body).toHaveProperty('custom', 'Internal Server Error');
                expect(body).toHaveProperty('message', 'invalid recipe_name');
                expect(body.custom).toMatch(/Internal Server Error/i);
                expect(body.message).toMatch(/invalid recipe_name/i);
            });
    });

    it('Delete Valid Recipe (200)', async () => {
        const created = { recipe_name: 'Temp Recipe' };
        await request(server).post('/api/recipes')
            .send(created);
        return request(server).delete('/api/recipes/2')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '166')
            .then(res => {
                const { body } = res;
                const deleted = {
                    recipe_id: 2,
                    recipe_name: 'Temp Recipe',
                    created_at: body.created_at,
                    steps: [
                      {
                        step_id: null,
                        step_number: null,
                        step_instructions: null,
                        ingredients: []
                      }
                    ]
                };
                expect(body).toMatchObject(deleted);
            });
    });

    it('Delete Invalid Recipe (404)', async () => {
        return request(server).delete('/api/recipes/2')
            .expect(404)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '81')
            .then(res => {
                const { body } = res;
                expect(body).toHaveProperty('custom', 'Internal Server Error');
                expect(body).toHaveProperty('message', 'Recipe with recipe_id 2 not found.');
                expect(body.custom).toMatch(/Internal Server Error/i);
                expect(body.message).toMatch(/Recipe with recipe_id 2 not found./i);
            });
    });

});
