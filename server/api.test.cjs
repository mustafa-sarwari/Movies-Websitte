const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { buildServer } = require('./index.cjs');
test('proxies approved movie routes and stores session favorites', async () => {
  let requested;
  const server = buildServer({ database: ':memory:', token: 'test-token', fetchImpl: async url => { requested = new URL(url); return new Response(JSON.stringify({ results: [{ id: 1, title: 'Sample' }] }), { headers: { 'Content-Type': 'application/json' } }); } });
  server.listen(0, '127.0.0.1'); await once(server,'listening'); const url = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(url + '/api/movies?page=2')).status, 200); assert.equal(requested.searchParams.get('page'), '2');
    assert.equal((await fetch(url + '/api/movies?page=0')).status, 400);
    assert.equal((await fetch(url + '/api/movies/not-an-id')).status, 404);
    const response = await fetch(url + '/api/favorites', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({movieId:1,title:'Sample'}) });
    assert.equal(response.status,201); const cookie=response.headers.get('set-cookie').split(';')[0];
    assert.equal((await (await fetch(url+'/api/favorites',{headers:{Cookie:cookie}})).json()).length,1);
    assert.equal((await (await fetch(url+'/api/favorites')).json()).length,0);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
