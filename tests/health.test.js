const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/server');

test('GET /api/health returns healthy service metadata', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.ok(body.service);
    assert.ok(body.version);
    assert.ok(body.timestamp);
  } finally {
    server.close();
  }
});
