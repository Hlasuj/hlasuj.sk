/**
 * Tests for POST /api/admin/login
 *
 * Covers: correct password → 200 + sets cookie,
 *         wrong password → 401,
 *         missing ADMIN_PASSWORD env var → 401.
 */
import { NextRequest } from 'next/server';
import { POST } from '../app/api/admin/login/route';

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const CORRECT_PW = 'super-secret-pw';

describe('POST /api/admin/login', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = CORRECT_PW;
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns 200 and sets admin_token cookie on correct password', async () => {
    const res = await POST(makeRequest({ password: CORRECT_PW }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ success: true });

    // Cookie must be present in Set-Cookie header
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toMatch(/admin_token=/);
    expect(setCookie).toMatch(/HttpOnly/i);
  });

  it('returns 401 on wrong password', async () => {
    const res = await POST(makeRequest({ password: 'wrong' }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Invalid password');
  });

  it('returns 401 when ADMIN_PASSWORD env var is not set', async () => {
    delete process.env.ADMIN_PASSWORD;

    const res = await POST(makeRequest({ password: 'anything' }));
    expect(res.status).toBe(401);
  });

  it('does not set a cookie on failed login', async () => {
    const res = await POST(makeRequest({ password: 'nope' }));
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).not.toMatch(/admin_token=/);
  });
});
