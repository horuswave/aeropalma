"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaPlane,
  FaInbox,
  FaTrashAlt,
  FaSyncAlt,
  FaSignOutAlt,
  FaFlagUsa,
  FaFlag,
  FaThumbsUp,
  FaComment,
  FaClipboardList,
  FaLanguage,
  FaUserFriends,
  FaStar,
  FaChartLine,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import { MdFeedback, MdOutlineEmojiEmotions } from "react-icons/md";
import { BiHappy } from "react-icons/bi";

// ─── Must match the key used in the survey page.tsx ──────────────
const STORE_KEY = "aeropalma_responses";
const OWNER_PASSWORD = "afungi2024"; // ← change this!

// ─── Types ────────────────────────────────────────────────────────
interface SurveyResponse {
  lang: "en" | "pt";
  firstTime: string | null;
  ratings: Record<string, number>;
  issues: string[];
  staffHelpful: number;
  staffClear: number;
  overall: number;
  liked: string;
  improve: string;
  comments: string;
  ts: number;
}

// ─── Helpers ──────────────────────────────────────────────────────
function getResponses(): SurveyResponse[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function avg(arr: number[]): string {
  if (!arr.length) return "—";
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

const COLORS = [
  "#CE5605",
  "#1D9E75",
  "#378ADD",
  "#D85A30",
  "#7F77DD",
  "#D4537E",
];

// ─── Bar ──────────────────────────────────────────────────────────
function Bar({
  label,
  value,
  max = 5,
  color = "#CE5605",
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          width: "180px",
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          background: "var(--border)",
          borderRadius: "4px",
          height: "14px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "4px",
            transition: "width .6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          width: "30px",
        }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Metric card ─────────────────────────────────────────────────
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-1px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────
export default function OwnerDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  // reload responses every time we authenticate or the window focuses
  const load = () => setResponses(getResponses());

  useEffect(() => {
    if (authed) {
      load();
      window.addEventListener("focus", load);
      return () => window.removeEventListener("focus", load);
    }
  }, [authed]);

  const login = () => {
    if (pwd === OWNER_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPwd("");
    }
  };

  // ── Login screen ────────────────────────────────────────────────
  if (!authed) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "40px 32px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <img
                src="/logo.svg"
                alt="AeroPalma"
                style={{ height: "64px", width: "auto" }}
              />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: ".08em",
                background: "#CE5605",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "4px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FaLock size={10} /> OWNER PORTAL
            </span>
          </div>

          <label
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Enter owner password"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              border: `1px solid ${error ? "#e53e3e" : "var(--border)"}`,
              background: "var(--input-bg)",
              color: "var(--text-primary)",
              fontSize: "14px",
              marginBottom: "6px",
            }}
            autoFocus
          />
          {error && (
            <p
              style={{
                fontSize: "12px",
                color: "#e53e3e",
                marginBottom: "10px",
              }}
            >
              Incorrect password. Try again.
            </p>
          )}

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "11px",
              background: "#CE5605",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            Sign in <FaArrowRight size={12} />
          </button>
        </div>
      </main>
    );
  }

  // ── No data state ───────────────────────────────────────────────
  if (!responses.length) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          padding: "40px 24px",
        }}
      >
        <TopBar onLogout={() => setAuthed(false)} onRefresh={load} />
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            <FaInbox style={{ margin: "0 auto" }} />
          </div>
          <p style={{ fontSize: "16px", fontWeight: 700 }}>No responses yet</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>
            Responses appear here as passengers complete the survey.
          </p>
        </div>
      </main>
    );
  }

  // ── Compute stats ───────────────────────────────────────────────
  const total = responses.length;
  const langEn = responses.filter((r) => r.lang === "en").length;
  const langPt = responses.filter((r) => r.lang === "pt").length;
  const firstTimers = responses.filter(
    (r) => r.firstTime === "Yes" || r.firstTime === "Sim",
  ).length;

  const overallScores = responses.map((r) => r.overall).filter(Boolean);
  const staffHScores = responses.map((r) => r.staffHelpful).filter(Boolean);
  const staffCScores = responses.map((r) => r.staffClear).filter(Boolean);

  const overallDist = [1, 2, 3, 4, 5].map(
    (n) => responses.filter((r) => r.overall === n).length,
  );

  // area ratings
  const areaTotals: Record<string, number[]> = {};
  responses.forEach((r) => {
    Object.entries(r.ratings ?? {}).forEach(([k, v]) => {
      if (!areaTotals[k]) areaTotals[k] = [];
      areaTotals[k].push(v);
    });
  });
  const areaAvgs = Object.entries(areaTotals)
    .map(([k, vals]) => ({ label: k, value: parseFloat(avg(vals)) }))
    .sort((a, b) => b.value - a.value);

  // issues
  const issueCounts: Record<string, number> = {};
  responses.forEach((r) => {
    (r.issues ?? []).forEach((iss) => {
      if (iss !== "No issues" && iss !== "Nenhum problema")
        issueCounts[iss] = (issueCounts[iss] ?? 0) + 1;
    });
  });
  const sortedIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);

  // open feedback
  const feedback = responses
    .filter((r) => r.liked || r.improve || r.comments)
    .slice(-10)
    .reverse();

  const card: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "20px 24px",
    marginBottom: "16px",
  };

  // ── Dashboard ───────────────────────────────────────────────────
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "clamp(16px,4vw,40px) clamp(16px,5vw,24px)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <TopBar onLogout={() => setAuthed(false)} onRefresh={load} />

        {/* KPIs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Metric label="Total responses" value={String(total)} />
          <Metric label="Avg overall score" value={`${avg(overallScores)}/5`} />
          <Metric
            label="First-time visitors"
            value={`${Math.round((firstTimers / total) * 100)}%`}
          />
          <Metric label="Staff helpfulness" value={`${avg(staffHScores)}/5`} />
          <Metric
            label="Staff communication"
            value={`${avg(staffCScores)}/5`}
          />
        </div>

        {/* Overall distribution */}
        <div style={card}>
          <SectionTitle>
            <FaStar style={{ marginRight: "4px" }} /> Overall score distribution
          </SectionTitle>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              height: "100px",
              marginTop: "12px",
            }}
          >
            {overallDist.map((count, i) => {
              const maxCount = Math.max(...overallDist, 1);
              const pct = (count / maxCount) * 100;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {count}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: `${pct}%`,
                      minHeight: count ? "4px" : "0",
                      background: "#CE5605",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {i + 1}★
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area ratings */}
        {areaAvgs.length > 0 && (
          <div style={card}>
            <SectionTitle>
              <FaChartLine style={{ marginRight: "4px" }} /> Area ratings (avg /
              5)
            </SectionTitle>
            <div style={{ marginTop: "12px" }}>
              {areaAvgs.map(({ label, value }, i) => (
                <Bar
                  key={label}
                  label={label}
                  value={value}
                  color={i < areaAvgs.length / 2 ? "#CE5605" : "#D85A30"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {sortedIssues.length > 0 && (
          <div style={card}>
            <SectionTitle>
              <FaClipboardList style={{ marginRight: "4px" }} /> Reported issues
            </SectionTitle>
            <div style={{ marginTop: "12px" }}>
              {sortedIssues.map(([iss, count], i) => (
                <div
                  key={iss}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: COLORS[i % COLORS.length],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "13px", flex: 1 }}>{iss}</span>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    {count} report{count !== 1 ? "s" : ""}
                  </span>
                  <div
                    style={{
                      width: "100px",
                      background: "var(--border)",
                      borderRadius: "4px",
                      height: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(count / total) * 100}%`,
                        height: "100%",
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language & first-timers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div style={card}>
            <SectionTitle>
              <FaLanguage style={{ marginRight: "4px" }} /> Language
            </SectionTitle>
            <StatRow
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FaFlagUsa /> English
                </span>
              }
              count={langEn}
              total={total}
            />
            <StatRow
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <FaFlag /> Português
                </span>
              }
              count={langPt}
              total={total}
            />
          </div>
          <div style={card}>
            <SectionTitle>
              <FaUserFriends style={{ marginRight: "4px" }} /> First-time
              visitors
            </SectionTitle>
            <StatRow
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <BiHappy /> Yes / Sim
                </span>
              }
              count={firstTimers}
              total={total}
            />
            <StatRow
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <MdOutlineEmojiEmotions /> No / Não
                </span>
              }
              count={total - firstTimers}
              total={total}
            />
          </div>
        </div>

        {/* Open feedback */}
        {feedback.length > 0 && (
          <div style={card}>
            <SectionTitle>
              <MdFeedback style={{ marginRight: "4px" }} /> Recent open feedback
            </SectionTitle>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {feedback.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {r.liked && (
                    <div>
                      <strong
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaThumbsUp size={12} /> Liked:
                      </strong>{" "}
                      {r.liked}
                    </div>
                  )}
                  {r.improve && (
                    <div>
                      <strong
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaChartLine size={12} /> Improve:
                      </strong>{" "}
                      {r.improve}
                    </div>
                  )}
                  {r.comments && (
                    <div>
                      <strong
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaComment size={12} /> Comments:
                      </strong>{" "}
                      {r.comments}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginTop: "6px",
                    }}
                  >
                    <span
                      style={{
                        background: r.lang === "en" ? "#e6f1fb" : "#eaf3de",
                        color: r.lang === "en" ? "#185fa5" : "#3b6d11",
                        padding: "1px 7px",
                        borderRadius: "20px",
                        marginRight: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {r.lang.toUpperCase()}
                    </span>
                    Overall: {r.overall || "—"}/5 · Staff:{" "}
                    {r.staffHelpful || "—"}/5 ·{" "}
                    {new Date(r.ts).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div style={{ textAlign: "right", marginTop: "8px" }}>
          <button
            onClick={() => {
              if (
                confirm(
                  "Delete all stored survey responses? This cannot be undone.",
                )
              ) {
                localStorage.removeItem(STORE_KEY);
                load();
              }
            }}
            style={{
              fontSize: "12px",
              color: "#e53e3e",
              background: "none",
              border: "1px solid #e53e3e44",
              borderRadius: "6px",
              padding: "6px 14px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FaTrashAlt size={10} /> Clear all responses
          </button>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────
function TopBar({
  onLogout,
  onRefresh,
}: {
  onLogout: () => void;
  onRefresh: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/logo.svg"
          alt="AeroPalma"
          style={{ height: "40px", width: "auto" }}
        />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: ".06em",
            background: "#CE5605",
            color: "#fff",
            padding: "2px 7px",
            borderRadius: "4px",
          }}
        >
          ANALYTICS
        </span>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onRefresh}
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "5px 12px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <FaSyncAlt size={10} /> Refresh
        </button>
        <button
          onClick={onLogout}
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "5px 12px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <FaSignOutAlt size={10} /> Sign out
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: ".06em",
        color: "var(--text-secondary)",
        textTransform: "uppercase",
        marginBottom: "4px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </p>
  );
}

function StatRow({
  label,
  count,
  total,
}: {
  label: React.ReactNode;
  count: number;
  total: number;
}) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      <span style={{ fontSize: "13px", flex: 1 }}>{label}</span>
      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
        {count} ({pct}%)
      </span>
    </div>
  );
}
