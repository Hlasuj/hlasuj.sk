"use client";
import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "sp2024admin";
const AGE_GROUPS = ["18–24", "25–34", "35–44", "45–54", "55+"];
const GENDERS = ["Muž", "Žena", "Iné", "Nechcem uviesť"];

const INITIAL_POLLS = [
  { id: "p1", question: "Ktorá téma je pre vás najdôležitejšia?", options: ["Životné náklady", "Bývanie", "Odchod mladých", "Korupcia", "EÚ orientácia", "Vzdelávanie"], active: true },
  { id: "p2", question: "Dôverujete súčasným politickým stranám?", options: ["Áno, plne", "Čiastočne", "Nie príliš", "Vôbec nie"], active: true },
  { id: "p3", question: "Ako hodnotíte členstvo SR v EÚ?", options: ["Veľmi pozitívne", "Skôr pozitívne", "Skôr negatívne", "Veľmi negatívne", "Neviem"], active: false },
];

const MOCK_VOTES: Vote[] = [
  { pollId: "p1", optionIndex: 3, timestamp: Date.now() - 86400000, country: "SK", device: "mobile", lang: "sk", age: "25–34", gender: "Muž" },
  { pollId: "p1", optionIndex: 0, timestamp: Date.now() - 72000000, country: "SK", device: "desktop", lang: "sk", age: "35–44", gender: "Žena" },
  { pollId: "p1", optionIndex: 3, timestamp: Date.now() - 50000000, country: "CZ", device: "desktop", lang: "cs", age: "18–24", gender: "Muž" },
  { pollId: "p1", optionIndex: 1, timestamp: Date.now() - 30000000, country: "SK", device: "mobile", lang: "sk", age: "45–54", gender: "Žena" },
  { pollId: "p1", optionIndex: 3, timestamp: Date.now() - 10000000, country: "DE", device: "mobile", lang: "sk", age: "25–34", gender: "Muž" },
  { pollId: "p2", optionIndex: 2, timestamp: Date.now() - 80000000, country: "SK", device: "desktop", lang: "sk", age: "55+", gender: "Muž" },
  { pollId: "p2", optionIndex: 3, timestamp: Date.now() - 60000000, country: "SK", device: "mobile", lang: "sk", age: "18–24", gender: "Žena" },
  { pollId: "p2", optionIndex: 3, timestamp: Date.now() - 40000000, country: "SK", device: "tablet", lang: "sk", age: "25–34", gender: "Muž" },
  { pollId: "p2", optionIndex: 1, timestamp: Date.now() - 20000000, country: "AT", device: "desktop", lang: "de", age: "35–44", gender: "Žena" },
  { pollId: "p3", optionIndex: 1, timestamp: Date.now() - 70000000, country: "SK", device: "mobile", lang: "sk", age: "18–24", gender: "Muž" },
  { pollId: "p3", optionIndex: 0, timestamp: Date.now() - 45000000, country: "SK", device: "desktop", lang: "sk", age: "45–54", gender: "Žena" },
  { pollId: "p3", optionIndex: 2, timestamp: Date.now() - 15000000, country: "SK", device: "mobile", lang: "sk", age: "25–34", gender: "Muž" },
];

interface Poll {
  id: string;
  question: string;
  options: string[];
  optionIds?: string[];
  active: boolean;
  collect_phone?: boolean;
}

interface Vote {
  pollId: string;
  optionIndex: number;
  timestamp: number;
  country: string;
  device: string;
  lang: string;
  age?: string;
  gender?: string;
}

interface Demographics {
  age: string;
  gender: string;
}

const G = {
  navy: "#0F2044",
  navyLight: "#1A3366",
  blue: "#2563EB",
  blueSoft: "#EEF3FF",
  ink: "#0A0F1E",
  slate: "#374151",
  muted: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  bg: "#FAFBFC",
  white: "#FFFFFF",
};

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${G.bg}; }
  .sp-chip { display: inline-flex; align-items: center; padding: 8px 18px; border: 1.5px solid ${G.border}; background: ${G.white}; color: ${G.slate}; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.15s; border-radius: 100px; }
  .sp-chip:hover { border-color: ${G.navy}; color: ${G.navy}; background: ${G.blueSoft}; }
  .sp-chip.active { border-color: ${G.navy}; background: ${G.navy}; color: #fff; }
  .sp-option { display: block; width: 100%; padding: 16px 20px; background: ${G.white}; border: 1.5px solid ${G.border}; text-align: left; font-family: 'DM Sans', sans-serif; font-size: 15px; color: ${G.slate}; cursor: pointer; transition: all 0.15s; border-radius: 4px; }
  .sp-option:hover { border-color: ${G.blue}; color: ${G.navy}; background: ${G.blueSoft}; }
  .sp-option.selected { border-color: ${G.navy}; background: ${G.navy}; color: #fff; font-weight: 500; }
  .sp-btn-primary { background: ${G.navy}; color: #fff; border: none; padding: 14px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; border-radius: 2px; }
  .sp-btn-primary:hover { background: ${G.navyLight}; transform: translateY(-1px); }
  .sp-btn-primary:disabled { background: ${G.border}; color: ${G.muted}; cursor: not-allowed; transform: none; }
  .sp-input { width: 100%; padding: 12px 16px; border: 1.5px solid ${G.border}; background: ${G.white}; font-family: 'DM Sans', sans-serif; font-size: 14px; color: ${G.ink}; outline: none; transition: border-color 0.15s; border-radius: 2px; }
  .sp-input:focus { border-color: ${G.navy}; }
  .sp-input.error { border-color: #EF4444; }
  .fade-in { animation: fadeUp 0.4s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .bar-fill { transition: width 0.7s cubic-bezier(0.4,0,0.2,1); }
  .admin-dark { background: ${G.ink}; min-height: 100vh; color: #f0f0f0; font-family: 'DM Sans', sans-serif; }
`;

function Styles() {
  return <style dangerouslySetInnerHTML={{ __html: cssStyles }} />;
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 28, height: 28, background: dark ? "#fff" : G.navy, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: dark ? G.navy : "#fff" }} />
      </div>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: dark ? "#fff" : G.navy }}>hlasuj.sk</span>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 6, background: G.borderLight, borderRadius: 3, overflow: "hidden" }}>
        <div className="bar-fill" style={{ width: `${pct}%`, height: "100%", background: color || G.navy, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, color: G.muted, minWidth: 36, textAlign: "right", fontFamily: "'DM Sans', sans-serif" }}>{pct}%</span>
    </div>
  );
}

function DemographicGate({ onConfirm }: { onConfirm: (age: string, gender: string) => void }) {
  const [age, setAge] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const ready = age && gender;

  return (
    <div style={{ minHeight: "100vh", background: G.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Styles />
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "20px 40px", background: G.white }}>
        <Logo />
      </div>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px 40px" }} className="fade-in">
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: G.blue, marginBottom: 16 }}>Krok 1 z 2</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: G.ink, lineHeight: 1.2, marginBottom: 16 }}>Najskôr pár slov o vás</h1>
          <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.7 }}>Žiadne osobné údaje. Tieto informácie nám pomáhajú pochopiť, čo si myslia rôzne skupiny Slovákov.</p>
        </div>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted, marginBottom: 14 }}>Veková skupina</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AGE_GROUPS.map((a) => (
              <button key={a} className={`sp-chip ${age === a ? "active" : ""}`} onClick={() => setAge(a)}>{a}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted, marginBottom: 14 }}>Pohlavie</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GENDERS.map((g) => (
              <button key={g} className={`sp-chip ${gender === g ? "active" : ""}`} onClick={() => setGender(g)}>{g}</button>
            ))}
          </div>
        </div>
        <button className="sp-btn-primary" disabled={!ready} onClick={() => ready && onConfirm(age!, gender!)} style={{ width: "100%", padding: "18px", fontSize: 15 }}>
          Pokračovať k ankete →
        </button>
        <div style={{ marginTop: 32, padding: "16px 20px", background: G.blueSoft, borderRadius: 4, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 16, marginTop: 1 }}>🔒</div>
          <p style={{ fontSize: 13, color: G.slate, lineHeight: 1.6 }}>Vaše odpovede sú <strong>úplne anonymné</strong>. Nezbierame IP adresy ani cookies.</p>
        </div>
      </div>
    </div>
  );
}

function VoterPoll({ polls, demographics, onSubmit, onAdminAccess }: { polls: Poll[]; demographics: Demographics; onSubmit: (answers: Record<string, number>, phones: Record<string, string>) => void; onAdminAccess: () => void }) {
  const active = polls.filter((p) => p.active);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phones, setPhones] = useState<Record<string, string>>({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const answered = Object.keys(answers).length;
  const total = active.length;
  const allDone = answered === total && total > 0;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  function tryAdmin() {
    if (pass === ADMIN_PASSWORD) { onAdminAccess(); }
    else { setPassErr(true); setTimeout(() => setPassErr(false), 1500); }
  }

  return (
    <div style={{ minHeight: "100vh", background: G.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <Styles />
      <div style={{ borderBottom: `1px solid ${G.border}`, padding: "16px 40px", background: G.white, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 120, height: 4, background: G.borderLight, borderRadius: 2, overflow: "hidden" }}>
                <div className="bar-fill" style={{ width: `${progress}%`, height: "100%", background: G.blue, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 12, color: G.muted }}>{answered}/{total}</span>
            </div>
            <div style={{ fontSize: 13, color: G.muted }}>{demographics.age} · {demographics.gender}</div>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowAdmin(!showAdmin)} style={{ background: "none", border: "none", color: G.slate, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "4px 8px" }}>⋯</button>
              {showAdmin && (
                <div style={{ position: "absolute", right: 0, top: 36, background: G.white, border: `1px solid ${G.border}`, padding: 20, zIndex: 20, minWidth: 240, borderRadius: 6, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted, marginBottom: 12 }}>Admin prístup</div>
                  <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryAdmin()} placeholder="Heslo" className={`sp-input ${passErr ? "error" : ""}`} style={{ marginBottom: 10 }} />
                  <button onClick={tryAdmin} className="sp-btn-primary" style={{ width: "100%", padding: "10px 0" }}>Vstúpiť</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: G.blue, marginBottom: 14 }}>Krok 2 z 2</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: G.ink, lineHeight: 1.25, marginBottom: 12 }}>Povedzte nám, čo si myslíte.</h1>
          <p style={{ fontSize: 15, color: G.muted }}>Žiadna registrácia. Žiadne cookies. Len váš názor.</p>
        </div>
        {active.length === 0 && <div style={{ textAlign: "center", padding: "80px 0", color: G.muted }}>Momentálne nie sú aktívne žiadne ankety.</div>}
        {active.map((poll, pi) => (
          <div key={poll.id} className="fade-in" style={{ marginBottom: 52, animationDelay: `${pi * 0.1}s` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: answers[poll.id] !== undefined ? G.navy : G.borderLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: answers[poll.id] !== undefined ? "#fff" : G.muted, transition: "all 0.2s", flexShrink: 0 }}>
                {answers[poll.id] !== undefined ? "✓" : pi + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: G.muted }}>Otázka {pi + 1}</div>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: G.ink, lineHeight: 1.4, marginBottom: 20 }}>{poll.question}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {poll.options.map((opt, oi) => (
                <button key={oi} className={`sp-option ${answers[poll.id] === oi ? "selected" : ""}`} onClick={() => setAnswers({ ...answers, [poll.id]: oi })}>{opt}</button>
              ))}
            </div>
            {poll.collect_phone && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>Telefónne číslo <span style={{ color: G.border }}>(nepovinné)</span></div>
                <input
                  type="tel"
                  value={phones[poll.id] || ""}
                  onChange={(e) => setPhones({ ...phones, [poll.id]: e.target.value })}
                  placeholder="+421..."
                  className="sp-input"
                  style={{ maxWidth: 240 }}
                />
              </div>
            )}
          </div>
        ))}
        {active.length > 0 && (
          <button className="sp-btn-primary" disabled={!allDone} onClick={() => allDone && onSubmit(answers, phones)} style={{ width: "100%", padding: "18px", fontSize: 15 }}>
            {allDone ? "Odoslať hlasovanie →" : `Odpovedzte na všetky otázky (${answered}/${total})`}
          </button>
        )}
      </div>
    </div>
  );
}

function ThankYou() {
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <Styles />
      <div className="fade-in" style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: G.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 24, color: "#fff" }}>✓</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: G.ink, marginBottom: 16 }}>Ďakujeme!</h1>
        <p style={{ fontSize: 16, color: G.muted, lineHeight: 1.7, marginBottom: 32 }}>Váš hlas bol zaznamenaný. Pomáhate nám pochopiť, čo si Slováci skutočne myslia.</p>
        <div style={{ background: G.blueSoft, border: `1px solid ${G.border}`, borderRadius: 6, padding: "20px 24px" }}>
          <p style={{ fontSize: 13, color: G.slate, lineHeight: 1.6 }}>Výsledky pravidelne zverejňujeme na <strong>hlasuj.sk</strong>.</p>
        </div>
      </div>
    </div>
  );
}

function AdminBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
        <div className="bar-fill" style={{ width: `${pct}%`, height: "100%", background: G.blue, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, color: "#555", minWidth: 32, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

function ResultsDashboard({ polls, votes }: { polls: Poll[]; votes: Vote[] }) {
  const [activeId, setActiveId] = useState(polls[0]?.id);
  const [filterAge, setFilterAge] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const poll = polls.find((p) => p.id === activeId);
  if (!poll) return <div style={{ padding: 40, color: "#444", textAlign: "center" }}>Žiadne ankety.</div>;

  const pv = votes.filter((v) => v.pollId === activeId && (filterAge === "all" || v.age === filterAge) && (filterGender === "all" || v.gender === filterGender));
  const total = pv.length;
  const byOpt = poll.options.map((_, i) => pv.filter((v) => v.optionIndex === i).length);
  const byC: Record<string, number> = {}, byD: Record<string, number> = {}, byA: Record<string, number> = {}, byG: Record<string, number> = {};
  pv.forEach((v) => {
    byC[v.country] = (byC[v.country] || 0) + 1;
    byD[v.device] = (byD[v.device] || 0) + 1;
    if (v.age) byA[v.age] = (byA[v.age] || 0) + 1;
    if (v.gender) byG[v.gender] = (byG[v.gender] || 0) + 1;
  });

  const chipDark = (active: boolean) => ({ display: "inline-flex" as const, alignItems: "center" as const, padding: "5px 12px", border: `1px solid ${active ? G.blue : "#2a2a3a"}`, background: active ? G.blue : "transparent", color: active ? "#fff" : "#666", fontSize: 11, cursor: "pointer" as const, borderRadius: 100, fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" });

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Výsledky</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {polls.map((p) => <button key={p.id} onClick={() => setActiveId(p.id)} style={{ ...chipDark(activeId === p.id), padding: "8px 16px", fontSize: 12 }}>{p.question.length > 30 ? p.question.slice(0, 30) + "…" : p.question}</button>)}
      </div>
      <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", padding: "14px 18px", marginBottom: 28, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", borderRadius: 4 }}>
        <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>Filter</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setFilterAge("all")} style={chipDark(filterAge === "all")}>Všetky vek</button>
          {AGE_GROUPS.map((a) => <button key={a} onClick={() => setFilterAge(a)} style={chipDark(filterAge === a)}>{a}</button>)}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setFilterGender("all")} style={chipDark(filterGender === "all")}>Všetky pohlavia</button>
          {GENDERS.map((g) => <button key={g} onClick={() => setFilterGender(g)} style={chipDark(filterGender === g)}>{g}</button>)}
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 6, lineHeight: 1.4, fontFamily: "'Playfair Display', serif" }}>{poll.question}</div>
      <div style={{ fontSize: 13, color: G.blue, marginBottom: 28 }}>{total} hlasov</div>
      <div style={{ marginBottom: 36 }}>
        {poll.options.map((opt, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#bbb" }}>{opt}</span>
              <span style={{ fontSize: 11, color: "#444" }}>{byOpt[i]}</span>
            </div>
            <AdminBar value={byOpt[i]} max={total} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {([["Vek", byA, AGE_GROUPS], ["Pohlavie", byG, GENDERS], ["Krajina", byC, null], ["Zariadenie", byD, null]] as [string, Record<string, number>, string[] | null][]).map(([label, data, order]) => {
          const entries = order ? order.filter((k) => data[k]).map((k) => [k, data[k]] as [string, number]) : Object.entries(data).sort((a, b) => b[1] - a[1]);
          if (!entries.length) return null;
          return (
            <div key={label} style={{ background: "#0a0a14", border: "1px solid #1a1a2e", padding: 16, borderRadius: 4 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>{label}</div>
              {entries.map(([k, v]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#777" }}>{k}</span>
                    <span style={{ fontSize: 11, color: "#444" }}>{v}</span>
                  </div>
                  <AdminBar value={v} max={total} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PollManager({ polls, setPolls }: { polls: Poll[]; setPolls: (polls: Poll[]) => void }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Poll | null>(null);
  const [newOpt, setNewOpt] = useState("");
  const [saving, setSaving] = useState(false);

  const IS_NEW = draft && !polls.find((p) => p.id === draft.id);

  function startNew() { const d = { id: "__new__", question: "", options: [], active: false }; setDraft(d); setEditId(d.id); }
  function startEdit(p: Poll) { setDraft({ ...p, options: [...p.options] }); setEditId(p.id); }
  function cancel() { setEditId(null); setDraft(null); setNewOpt(""); }

  async function save() {
    if (!draft || !draft.question.trim() || draft.options.length < 2) return;
    setSaving(true);
    if (IS_NEW) {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: draft.question, options: draft.options, active: draft.active, collect_phone: draft.collect_phone ?? false }),
      });
      const data = await res.json();
      if (data.id) {
        const newPoll = { ...draft, id: data.id };
        setPolls([newPoll, ...polls]);
      }
    } else {
      await fetch(`/api/polls/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: draft.question, options: draft.options, active: draft.active, collect_phone: draft.collect_phone ?? false }),
      });
      setPolls(polls.map((p) => (p.id === draft.id ? draft : p)));
    }
    setSaving(false);
    cancel();
  }

  function addOpt() { if (!newOpt.trim() || !draft) return; setDraft({ ...draft, options: [...draft.options, newOpt.trim()] }); setNewOpt(""); }
  function removeOpt(i: number) { if (!draft) return; setDraft({ ...draft, options: draft.options.filter((_, j) => j !== i) }); }
  function moveOpt(i: number, d: number) {
    if (!draft) return;
    const opts = [...draft.options]; const j = i + d;
    if (j < 0 || j >= opts.length) return;
    [opts[i], opts[j]] = [opts[j], opts[i]];
    setDraft({ ...draft, options: opts });
  }

  async function toggle(id: string) {
    const poll = polls.find((p) => p.id === id);
    if (!poll) return;
    await fetch(`/api/polls/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !poll.active }),
    });
    setPolls(polls.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }

  async function del(id: string) {
    await fetch(`/api/polls/${id}`, { method: 'DELETE' });
    setPolls(polls.filter((p) => p.id !== id));
  }

  const canSave = draft && draft.question.trim() && draft.options.length >= 2;
  const adminInput = { width: "100%", padding: "10px 14px", background: "#0a0a14", border: "1px solid #1a1a2e", color: "#ddd", fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>Správa ankiet</div>
          <div style={{ fontSize: 11, color: "#333", marginTop: 4 }}>{polls.length} ankiet · {polls.filter((p) => p.active).length} aktívnych</div>
        </div>
        <button onClick={startNew} style={{ background: G.blue, border: "none", color: "#fff", padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, borderRadius: 2 }}>+ Nová anketa</button>
      </div>
      {editId && draft && (
        <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", padding: 24, marginBottom: 28, borderRadius: 4 }}>
          <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{IS_NEW ? "Nová anketa" : "Upraviť anketu"}</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Otázka</div>
            <input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} placeholder="Zadajte otázku..." style={adminInput} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Možnosti ({draft.options.length})</div>
            {draft.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <span style={{ color: "#333", fontSize: 11, minWidth: 18 }}>{i + 1}.</span>
                <div style={{ flex: 1, background: "#111", border: "1px solid #1a1a2e", padding: "8px 12px", fontSize: 13, color: "#bbb" }}>{opt}</div>
                <button onClick={() => moveOpt(i, -1)} style={{ ...adminInput, width: "auto", padding: "5px 10px", cursor: "pointer", color: "#666" }}>↑</button>
                <button onClick={() => moveOpt(i, 1)} style={{ ...adminInput, width: "auto", padding: "5px 10px", cursor: "pointer", color: "#666" }}>↓</button>
                <button onClick={() => removeOpt(i)} style={{ ...adminInput, width: "auto", padding: "5px 10px", cursor: "pointer", color: "#aa3333" }}>×</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input value={newOpt} onChange={(e) => setNewOpt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOpt()} placeholder="Pridať možnosť... (Enter)" style={{ ...adminInput, flex: 1 }} />
              <button onClick={addOpt} style={{ ...adminInput, width: "auto", padding: "10px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>Pridať</button>
            </div>
          </div>
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#aaa", fontFamily: "'DM Sans', sans-serif" }}>
              <input type="checkbox" checked={draft.collect_phone ?? false} onChange={(e) => setDraft({ ...draft, collect_phone: e.target.checked })} style={{ width: 16, height: 16, accentColor: G.blue }} />
              Zbierať telefónne číslo (nepovinné)
            </label>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={cancel} style={{ background: "none", border: "1px solid #2a2a3a", color: "#666", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Zrušiť</button>
            <button onClick={save} disabled={!canSave || saving} style={{ background: canSave && !saving ? G.blue : "#1a1a2e", border: "none", color: canSave && !saving ? "#fff" : "#444", padding: "8px 20px", cursor: canSave && !saving ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 12, fontWeight: 500 }}>{saving ? "Ukladám..." : "Uložiť"}</button>
          </div>
        </div>
      )}
      {polls.map((poll) => (
        <div key={poll.id} style={{ background: "#0a0a14", border: `1px solid ${poll.active ? "#1a2a3a" : "#1a1a2e"}`, marginBottom: 10, padding: "16px 20px", borderRadius: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: poll.active ? G.blue : "#2a2a2a" }} />
                <span style={{ fontSize: 10, color: poll.active ? G.blue : "#333", letterSpacing: "0.12em" }}>{poll.active ? "AKTÍVNA" : "NEAKTÍVNA"}</span>
              </div>
              <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5, marginBottom: 4 }}>{poll.question}</div>
              <div style={{ fontSize: 11, color: "#333" }}>{poll.options.length} možností</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {([
                [poll.active ? "Deaktivovať" : "Aktivovať", () => toggle(poll.id), false],
                ["Upraviť", () => startEdit(poll), false],
                ["Zmazať", () => del(poll.id), true],
              ] as [string, () => void, boolean][]).map(([label, action, danger]) => (
                <button key={label} onClick={action} style={{ background: "none", border: `1px solid ${danger ? "#2a1010" : "#1a1a2e"}`, color: danger ? "#aa3333" : "#555", padding: "5px 12px", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminShell({ polls, setPolls, votes, onBack }: { polls: Poll[]; setPolls: (polls: Poll[]) => void; votes: Vote[]; onBack: () => void }) {
  const [tab, setTab] = useState("results");
  const tabBtn = (t: string) => ({ background: tab === t ? G.blue : "transparent", border: `1px solid ${tab === t ? G.blue : "#1a1a2e"}`, color: tab === t ? "#fff" : "#555", padding: "6px 16px", cursor: "pointer" as const, fontSize: 12, fontFamily: "'DM Sans', sans-serif", borderRadius: 2, transition: "all 0.15s" });
  return (
    <div className="admin-dark">
      <Styles />
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Logo dark />
          <div style={{ display: "flex", gap: 6 }}>
            {[["results", "Výsledky"], ["manage", "Ankety"]].map(([t, l]) => <button key={t} onClick={() => setTab(t)} style={tabBtn(t)}>{l}</button>)}
          </div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #1a1a2e", color: "#555", padding: "6px 16px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>← Späť</button>
      </div>
      {tab === "results" ? <ResultsDashboard polls={polls} votes={votes} /> : <PollManager polls={polls} setPolls={setPolls} />}
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState("voter");
  const [step, setStep] = useState("gate");
  const [demographics, setDemographics] = useState<Demographics | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    fetch('/api/polls').then(r => r.json()),
    fetch('/api/votes').then(r => r.json()),
  ]).then(([pollsData, votesData]) => {
    const mapped = pollsData.map((p: any) => ({
      id: p.id,
      question: p.question,
      active: p.active,
      collect_phone: p.collect_phone ?? false,
      options: p.poll_options
        .sort((a: any, b: any) => a.position - b.position)
        .map((o: any) => o.text),
      optionIds: p.poll_options
        .sort((a: any, b: any) => a.position - b.position)
        .map((o: any) => o.id),
    }));
    setPolls(mapped);

    const mappedVotes = votesData.map((v: any) => ({
      pollId: v.poll_id,
      optionIndex: mapped.find((p: any) => p.id === v.poll_id)
        ?.optionIds?.indexOf(v.option_id) ?? 0,
      timestamp: new Date(v.timestamp).getTime(),
      country: v.country || 'SK',
      device: v.device_type || 'desktop',
      lang: v.browser_lang || 'sk',
      age: v.age_group,
      gender: v.gender,
    }));
    setVotes(mappedVotes);
    setLoading(false);
  });
}, []);

  async function handleSubmit(answers: Record<string, number>, phones: Record<string, string>) {
    for (const [pollId, optionIndex] of Object.entries(answers)) {
      const p = polls.find(p => p.id === pollId) as any;
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poll_id: pollId,
          option_id: p.optionIds[optionIndex],
          age_group: demographics?.age,
          gender: demographics?.gender,
          phone: phones[pollId] || null,
        }),
      });
    }
    setStep("done");
  }

  function handleGate(age: string, gender: string) { setDemographics({ age, gender }); setStep("poll"); }

  if (loading) return <div style={{ minHeight: "100vh", background: "#FAFBFC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#6B7280" }}>Načítavam...</div>;

  if (view === "admin") return <AdminShell polls={polls} setPolls={setPolls} votes={votes} onBack={() => { setView("voter"); setStep("gate"); }} />;
  if (step === "gate") return <DemographicGate onConfirm={handleGate} />;
  if (step === "done") return <ThankYou />;
  return <VoterPoll polls={polls} demographics={demographics!} onSubmit={handleSubmit} onAdminAccess={() => setView("admin")} />;
}
