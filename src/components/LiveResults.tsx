'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Mirror of G palette from page.tsx — avoid importing a client module into another client module
const G = {
  navy: '#0F2044',
  blue: '#2563EB',
  blueSoft: '#EEF3FF',
  ink: '#0A0F1E',
  slate: '#374151',
  muted: '#6B7280',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  bg: '#FAFBFC',
  white: '#FFFFFF',
};

interface Poll {
  id: string;
  question: string;
  options: string[];
  optionIds?: string[];
  active: boolean;
}

interface RawVote {
  option_id: string;
}

// ── Per-poll results panel ─────────────────────────────────────────────────

function ResultPoll({
  poll,
  selectedIdx,
}: {
  poll: Poll;
  selectedIdx?: number;
}) {
  const [counts, setCounts] = useState<number[]>(poll.options.map(() => 0));
  const [total, setTotal] = useState(0);
  // Delay bar animation until initial counts are loaded
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Fetch current snapshot — one-time load to seed the counters
    fetch(`/api/votes?poll_id=${poll.id}`)
      .then((r) => r.json())
      .then((votes: RawVote[]) => {
        const c = poll.options.map(
          (_, i) =>
            votes.filter((v) => v.option_id === poll.optionIds?.[i]).length
        );
        setCounts(c);
        setTotal(votes.length);
        setReady(true); // trigger bar animation
      });

    // 2. Subscribe — increment counters on each new INSERT, no re-fetch needed
    const channel = supabase
      .channel(`votes-live-${poll.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${poll.id}`,
        },
        (payload) => {
          const oid = (payload.new as { option_id: string }).option_id;
          const idx = poll.optionIds?.indexOf(oid) ?? -1;
          if (idx >= 0) {
            setCounts((c) => {
              const n = [...c];
              n[idx]++;
              return n;
            });
            setTotal((t) => t + 1);
          }
        }
      )
      .subscribe();

    // 3. Clean up when component unmounts (or poll changes)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [poll.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: 44 }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          fontWeight: 600,
          color: G.ink,
          lineHeight: 1.4,
          marginBottom: 22,
        }}
      >
        {poll.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {poll.options.map((opt, i) => {
          const pct = total === 0 ? 0 : Math.round((counts[i] / total) * 100);
          const isSelected = selectedIdx === i;
          return (
            <div key={i}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: isSelected ? G.navy : G.slate,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {opt}
                  {isSelected && (
                    <span style={{ color: G.blue, marginLeft: 6 }}>✓</span>
                  )}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: G.muted,
                  }}
                >
                  {pct}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: G.borderLight,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: ready ? `${pct}%` : '0%',
                    background: isSelected ? G.navy : G.blue,
                    borderRadius: 3,
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: G.muted,
        }}
      >
        {total} {total === 1 ? 'hlas' : total < 5 ? 'hlasy' : 'hlasov'} celkom
      </div>
    </div>
  );
}

// ── Top-level results screen ────────────────────────────────────────────────

export default function LiveResults({
  polls,
  votedAnswers,
}: {
  polls: Poll[];
  votedAnswers: Record<string, number>;
}) {
  const votedPolls = polls.filter(
    (p) => p.active && votedAnswers[p.id] !== undefined
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: G.bg,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes liveRing { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
      `}</style>

      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${G.border}`,
          padding: '16px 40px',
          background: G.white,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: G.navy,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 600,
              color: G.navy,
            }}
          >
            hlasuj.sk
          </span>
        </div>
      </div>

      <div
        style={{ maxWidth: 680, margin: '0 auto', padding: '52px 24px 80px' }}
      >
        {/* Confirmation banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 36,
            padding: '14px 20px',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 6,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#15803D',
            }}
          >
            Váš hlas bol zaznamenaný.
          </span>
        </div>

        {/* Live indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#16A34A',
              animation: 'liveRing 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: G.muted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Živé výsledky
          </span>
        </div>

        {votedPolls.map((poll) => (
          <ResultPoll
            key={poll.id}
            poll={poll}
            selectedIdx={votedAnswers[poll.id]}
          />
        ))}
      </div>
    </div>
  );
}
