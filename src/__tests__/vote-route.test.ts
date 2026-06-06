/**
 * Tests for POST /api/vote
 *
 * Strategy: mock @supabase/supabase-js so we never hit the real DB.
 * Each test controls what `.insert()` resolves to.
 */
import { NextRequest } from 'next/server';

// --- mock Supabase before importing the route ---
const mockInsert = jest.fn();
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ insert: mockInsert }),
  }),
}));

import { POST } from '../app/api/vote/route';

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/vote', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 200 { success: true } on valid vote', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const res = await POST(
      makeRequest({ poll_id: '1', option_id: '2', country: 'SK' })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ success: true });
  });

  it('passes correct fields to supabase insert', async () => {
    mockInsert.mockResolvedValue({ error: null });

    await POST(
      makeRequest({
        poll_id: 'p1',
        option_id: 'o1',
        country: 'CZ',
        device_type: 'mobile',
        browser_lang: 'cs',
        age_group: '25-34',
        gender: 'M',
        phone: '+420123456789',
      })
    );

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        poll_id: 'p1',
        option_id: 'o1',
        country: 'CZ',
        device_type: 'mobile',
        phone: '+420123456789',
      })
    );
  });

  it('uses SK / desktop / sk defaults when fields are omitted', async () => {
    mockInsert.mockResolvedValue({ error: null });

    await POST(makeRequest({ poll_id: 'p1', option_id: 'o1' }));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        country: 'SK',
        device_type: 'desktop',
        browser_lang: 'sk',
        phone: null,
      })
    );
  });

  it('returns 500 with error message when Supabase fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB exploded' } });

    const res = await POST(makeRequest({ poll_id: 'p1', option_id: 'o1' }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('DB exploded');
  });
});
