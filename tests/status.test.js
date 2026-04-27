const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/server');

test('GET /api/status returns service status dashboard data', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/status`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.services));
    assert.ok(body.services.length >= 3);
    assert.ok(Array.isArray(body.incidents));
    assert.ok(body.summary.operational >= 1);
  } finally {
    server.close();
  }
});
