/**
 * Tests for POST /api/polls (poll creation)
 *
 * Covers: auth guard, validation, successful creation flow.
 * Mocks Supabase and the auth helper so tests stay unit-level.
 */
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// --- mock Supabase ---
const mockPollInsert = jest.fn();
const mockOptionsInsert = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'polls') {
        return {
          insert: () => ({
            select: () => ({
              single: mockPollInsert,
            }),
          }),
          select: () => ({
            order: () => ({ data: [], error: null }),
          }),
        };
      }
      // poll_options
      return { insert: mockOptionsInsert };
    },
  }),
}));

import { POST } from '../app/api/polls/route';

const ADMIN_PW = 'testpw';
const ADMIN_TOKEN = crypto.createHash('sha256').update(ADMIN_PW).digest('hex');

function makeRequest(body: object, withAuth = true) {
  const req = new NextRequest('http://localhost/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(withAuth ? { Cookie: `admin_token=${ADMIN_TOKEN}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return req;
}

describe('POST /api/polls', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = ADMIN_PW;
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns 401 when no auth cookie is present', async () => {
    const res = await POST(
      makeRequest({ question: 'Q?', options: ['A', 'B'] }, false)
    );
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 when question is missing', async () => {
    const res = await POST(makeRequest({ options: ['A', 'B'] }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when fewer than 2 options are provided', async () => {
    const res = await POST(
      makeRequest({ question: 'Valid?', options: ['Only one'] })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid data');
  });

  it('creates poll and options, returns { id } on success', async () => {
    mockPollInsert.mockResolvedValue({
      data: { id: 'new-poll-id' },
      error: null,
    });
    mockOptionsInsert.mockResolvedValue({ error: null });

    const res = await POST(
      makeRequest({
        question: 'Best framework?',
        options: ['Next.js', 'Remix', 'SvelteKit'],
      })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ id: 'new-poll-id' });
    expect(mockOptionsInsert).toHaveBeenCalledWith([
      { poll_id: 'new-poll-id', text: 'Next.js', position: 0 },
      { poll_id: 'new-poll-id', text: 'Remix', position: 1 },
      { poll_id: 'new-poll-id', text: 'SvelteKit', position: 2 },
    ]);
  });

  it('returns 500 if poll insert fails', async () => {
    mockPollInsert.mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    });

    const res = await POST(
      makeRequest({ question: 'Q?', options: ['A', 'B'] })
    );
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB error');
  });

  it('returns 500 if options insert fails', async () => {
    mockPollInsert.mockResolvedValue({ data: { id: 'pid' }, error: null });
    mockOptionsInsert.mockResolvedValue({
      error: { message: 'options failed' },
    });

    const res = await POST(
      makeRequest({ question: 'Q?', options: ['A', 'B'] })
    );
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('options failed');
  });
});
