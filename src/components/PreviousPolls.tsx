'use client';
import { useState, useEffect } from 'react';

const AGE_GROUPS = ['18–24', '25–34', '35–44', '45–54', '55+'];

interface PollOption {
  id: string;
  text: string;
  position: number;
  votes: number;
}

interface PreviousPoll {
  id: string;
  question: string;
  ends_at: string;
  poll_options: PollOption[];
}

interface RawVote {
  poll_id: string;
  option_id: string;
  age_group: string | null;
  gender: string | null;
}

// Recalculate vote counts from raw votes filtered by demographics
function calcCounts(
  options: PollOption[],
  votes: RawVote[],
  gender: string,
  age: string
): { text: string; count: number; pct: number }[] {
  const filtered = votes.filter(
    (v) =>
      (gender === 'Všetci' || v.gender === gender) &&
      (age === 'Všetky' || v.age_group === age)
  );
  const total = filtered.length;
  return options.map((opt) => {
    const count = filtered.filter((v) => v.option_id === opt.id).length;
    return {
      text: opt.text,
      count,
      pct: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  });
}

function BarChart({
  rows,
}: {
  rows: { text: string; count: number; pct: number }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((r, i) => (
        <div key={i}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 5,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ fontSize: 13, color: '#2D3748' }}>{r.text}</span>
            <span style={{ fontSize: 12, color: '#555' }}>
              {r.count} ({r.pct}%)
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: '#E2E8F0',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${r.pct}%`,
                background: '#2563EB',
                borderRadius: 3,
                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: '#555',
      }}
    >
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: '#F0F2F5',
          border: '1px solid #D1D9E6',
          color: '#333',
          padding: '4px 8px',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function PollCard({ poll }: { poll: PreviousPoll }) {
  const [open, setOpen] = useState(false);
  const [votes, setVotes] = useState<RawVote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState('Všetci');
  const [age, setAge] = useState('Všetky');

  async function load() {
    if (votes !== null) return;
    setLoading(true);
    const data = await fetch(`/api/votes?poll_id=${poll.id}`).then((r) =>
      r.json()
    );
    setVotes(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function toggle() {
    if (!open) load();
    setOpen((o) => !o);
  }

  // When votes are loaded use them for filtering; fall back to aggregate counts from API
  const rows = (() => {
    if (votes !== null)
      return calcCounts(poll.poll_options, votes, gender, age);
    const totalVotes = poll.poll_options.reduce((s, x) => s + x.votes, 0);
    return poll.poll_options.map((o) => ({
      text: o.text,
      count: o.votes,
      pct: totalVotes === 0 ? 0 : Math.round((o.votes / totalVotes) * 100),
    }));
  })();

  const endDate = poll.ends_at
    ? new Date(poll.ends_at).toLocaleDateString('sk-SK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div style={{ borderBottom: '1px solid #D1D9E6' }}>
      <button
        onClick={toggle}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          padding: '18px 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 15,
              fontWeight: 600,
              color: '#0F2044',
              lineHeight: 1.4,
              marginBottom: 3,
            }}
          >
            {poll.question}
          </div>
          {endDate && (
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: '#444',
              }}
            >
              Skončila {endDate}
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 18,
            color: '#444',
            flexShrink: 0,
            display: 'inline-block',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.2s ease',
            lineHeight: 1,
          }}
        >
          +
        </span>
      </button>

      {open && (
        <div style={{ paddingBottom: 24 }}>
          {loading && (
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: '#444',
                padding: '12px 0',
              }}
            >
              Načítavam...
            </div>
          )}
          {!loading && (
            <>
              {votes !== null && (
                <div
                  style={{
                    display: 'flex',
                    gap: 20,
                    marginBottom: 20,
                    flexWrap: 'wrap',
                  }}
                >
                  <SelectFilter
                    label="Pohlavie:"
                    value={gender}
                    options={['Všetci', 'Muž', 'Žena', 'Iné', 'Nechcem uviesť']}
                    onChange={setGender}
                  />
                  <SelectFilter
                    label="Vek:"
                    value={age}
                    options={['Všetky', ...AGE_GROUPS]}
                    onChange={setAge}
                  />
                </div>
              )}
              <BarChart rows={rows} />
              {votes !== null && (
                <div
                  style={{
                    marginTop: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: '#333',
                  }}
                >
                  {
                    votes.filter(
                      (v) =>
                        (gender === 'Všetci' || v.gender === gender) &&
                        (age === 'Všetky' || v.age_group === age)
                    ).length
                  }{' '}
                  hlasov
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function PreviousPolls({ onBack }: { onBack: () => void }) {
  const [polls, setPolls] = useState<PreviousPoll[] | null>(null);

  useEffect(() => {
    fetch('/api/polls/previous')
      .then((r) => r.json())
      .then((data) => setPolls(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAFBFC',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div
        style={{
          borderBottom: '1px solid #D1D9E6',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              background: '#0F2044',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#FAFBFC',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 17,
              fontWeight: 600,
              color: '#0F2044',
            }}
          >
            hlasuj.sk
          </span>
        </div>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: '1px solid #D1D9E6',
            color: '#555',
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          ← Späť
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
        <div
          style={{
            fontSize: 11,
            color: '#444',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Archív
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 600,
            color: '#0F2044',
            marginBottom: 40,
            lineHeight: 1.3,
          }}
        >
          Predchádzajúce ankety
        </h1>

        {polls === null && (
          <div style={{ color: '#444', fontSize: 14 }}>Načítavam...</div>
        )}
        {polls !== null && polls.length === 0 && (
          <div style={{ color: '#444', fontSize: 14 }}>
            Zatiaľ žiadne ukončené ankety.
          </div>
        )}
        {polls !== null && polls.map((p) => <PollCard key={p.id} poll={p} />)}
      </div>
    </div>
  );
}
