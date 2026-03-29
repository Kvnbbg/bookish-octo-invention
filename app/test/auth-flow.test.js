import test from 'node:test';
import assert from 'node:assert/strict';

async function loadApp(envOverrides = {}) {
  const previousEnv = { ...process.env };

  Object.assign(process.env, {
    NODE_ENV: 'test',
    SESSION_SECRET: 'test-session-secret',
    ...envOverrides,
  });

  const moduleUrl = new URL(`../server.js?test=${Date.now()}-${Math.random()}`, import.meta.url);

  try {
    const { default: app } = await import(moduleUrl);
    return app;
  } finally {
    process.env = previousEnv;
  }
}

test('authenticated users are redirected away from login and signup pages', async () => {
  const app = await loadApp();
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();

    const username = `user_${Date.now()}`;
    const signupResponse = await fetch(`http://127.0.0.1:${port}/signup`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password: 'safe-password-123' }),
      redirect: 'manual',
    });

    assert.equal(signupResponse.status, 302);
    assert.equal(signupResponse.headers.get('location'), '/app');

    const cookieHeader = signupResponse.headers.get('set-cookie') ?? '';
    const sessionCookie = cookieHeader.split(';')[0];

    assert.match(sessionCookie, /^connect\.sid=/);

    const [loginPageResponse, signupPageResponse] = await Promise.all([
      fetch(`http://127.0.0.1:${port}/login`, {
        headers: {
          cookie: sessionCookie,
        },
        redirect: 'manual',
      }),
      fetch(`http://127.0.0.1:${port}/signup`, {
        headers: {
          cookie: sessionCookie,
        },
        redirect: 'manual',
      }),
    ]);

    assert.equal(loginPageResponse.status, 302);
    assert.equal(loginPageResponse.headers.get('location'), '/app');

    assert.equal(signupPageResponse.status, 302);
    assert.equal(signupPageResponse.headers.get('location'), '/app');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
