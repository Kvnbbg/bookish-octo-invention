import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

async function loadApp(envOverrides = {}) {
  const previousEnv = { ...process.env };

  Object.assign(process.env, {
    NODE_ENV: 'production',
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

test('vercel-style forwarded https requests can persist the session cookie', async () => {
  const app = await loadApp({ VERCEL: '1' });
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address();

    const response = await fetch(`http://127.0.0.1:${port}/app`, {
      headers: {
        'x-forwarded-proto': 'https',
      },
      redirect: 'manual',
    });

    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), '/signup?auth=required');
    assert.match(response.headers.get('set-cookie') ?? '', /connect\.sid=.*Secure/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('vercel serverless imports do not start their own listener', () => {
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "process.env.NODE_ENV='production'; process.env.SESSION_SECRET='test-session-secret'; process.env.VERCEL='1'; await import('./api/index.js');",
    ],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /Server is running on port/i);
});
