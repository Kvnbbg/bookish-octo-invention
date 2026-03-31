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

function getSessionCookie(response) {
  const cookieHeader = response.headers.get('set-cookie') ?? '';
  return cookieHeader.split(';')[0];
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

    const sessionCookie = getSessionCookie(signupResponse);

    assert.match(sessionCookie, /^connect\.sid=/);

    const [loginPageResponse, signupPageResponse, loginPostResponse, signupPostResponse] = await Promise.all([
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
      fetch(`http://127.0.0.1:${port}/login/password`, {
        method: 'POST',
        headers: {
          cookie: sessionCookie,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username: 'ignored', password: 'ignored' }),
        redirect: 'manual',
      }),
      fetch(`http://127.0.0.1:${port}/signup`, {
        method: 'POST',
        headers: {
          cookie: sessionCookie,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username: 'ignored', password: 'ignored' }),
        redirect: 'manual',
      }),
    ]);

    assert.equal(loginPageResponse.status, 302);
    assert.equal(loginPageResponse.headers.get('location'), '/app');

    assert.equal(signupPageResponse.status, 302);
    assert.equal(signupPageResponse.headers.get('location'), '/app');

    assert.equal(loginPostResponse.status, 302);
    assert.equal(loginPostResponse.headers.get('location'), '/app');

    assert.equal(signupPostResponse.status, 302);
    assert.equal(signupPostResponse.headers.get('location'), '/app');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('protected route redirects back to original path after signup', async () => {
  const app = await loadApp();
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();

    const protectedResponse = await fetch(`http://127.0.0.1:${port}/profile?tab=privacy`, {
      redirect: 'manual',
    });

    assert.equal(protectedResponse.status, 302);
    assert.equal(protectedResponse.headers.get('location'), '/login?auth=required');

    const anonymousCookie = getSessionCookie(protectedResponse);
    assert.match(anonymousCookie, /^connect\.sid=/);

    const username = `signup_return_${Date.now()}`;
    const signupResponse = await fetch(`http://127.0.0.1:${port}/signup`, {
      method: 'POST',
      headers: {
        cookie: anonymousCookie,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password: 'safe-password-123' }),
      redirect: 'manual',
    });

    assert.equal(signupResponse.status, 302);
    assert.equal(signupResponse.headers.get('location'), '/profile?tab=privacy');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('post-auth return target is consumed once and does not leak to later sessions', async () => {
  const app = await loadApp();
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();

    const protectedResponse = await fetch(`http://127.0.0.1:${port}/profile`, {
      redirect: 'manual',
    });

    const anonymousCookie = getSessionCookie(protectedResponse);
    assert.match(anonymousCookie, /^connect\.sid=/);

    const username = `return_once_${Date.now()}`;
    const signupResponse = await fetch(`http://127.0.0.1:${port}/signup`, {
      method: 'POST',
      headers: {
        cookie: anonymousCookie,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password: 'safe-password-123' }),
      redirect: 'manual',
    });

    assert.equal(signupResponse.status, 302);
    assert.equal(signupResponse.headers.get('location'), '/profile');

    const authenticatedCookie = getSessionCookie(signupResponse) || anonymousCookie;

    const logoutResponse = await fetch(`http://127.0.0.1:${port}/logout`, {
      headers: {
        cookie: authenticatedCookie,
      },
      redirect: 'manual',
    });

    assert.equal(logoutResponse.status, 302);
    assert.equal(logoutResponse.headers.get('location'), '/login');

    const postLogoutCookie = getSessionCookie(logoutResponse) || authenticatedCookie;

    const loginResponse = await fetch(`http://127.0.0.1:${port}/login/password`, {
      method: 'POST',
      headers: {
        cookie: postLogoutCookie,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ username, password: 'safe-password-123' }),
      redirect: 'manual',
    });

    assert.equal(loginResponse.status, 302);
    assert.equal(loginResponse.headers.get('location'), '/app');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
