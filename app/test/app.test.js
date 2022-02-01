const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

describe('Test Cases', () => {
  it('healthcheck', async () => {
    const response = await request.get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toStrictEqual({"status": "OK"});
  });

  it('get all objects', async () => {
    const response = await request.get('/picus/list');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body.length).toStrictEqual(5);
  });

  it('get specific object', async () => {
    const response = await request.get('/picus/get/0a1dea90997f867b124039ea5fbbd328baef9629');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toStrictEqual({"test": "OK3"});
  });

  it('get nonexists object', async () => {
    const response = await request.get('/picus/get/0a1dea90997f867b124039ea5fbbd328baef96123');

    expect(response.status).toBe(500);
    expect(response.body).toStrictEqual({"status": "Could not retrieve file from S3: The specified key does not exist."});
  });
});
