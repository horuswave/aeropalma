"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  FaList,
  FaChartBar,
  FaDownload,
} from "react-icons/fa";
import { MdFeedback, MdOutlineEmojiEmotions } from "react-icons/md";
import { BiHappy } from "react-icons/bi";

// ─── Types ────────────────────────────────────────────────────────
interface AnalyticsData {
  total: number;
  langEn: number;
  langPt: number;
  firstTimers: number;
  ratings: {
    checkinWaitTime: number;
    checkinEfficiency: number;
    securityWaitTime: number;
    securityOrganization: number;
    staffProfessionalism: number;
    cleanlinessToilets: number;
    cleanlinessTerminal: number;
  };
  staffHelpful: number;
  staffClear: number;
  overallRating: number;
  issueCounts: Record<string, number>;
}

interface SurveyResponse {
  id: string;
  ts: string;
  lang: string;
  firstTime: string | null;
  checkinWaitTime: number | null;
  checkinEfficiency: number | null;
  securityWaitTime: number | null;
  securityOrganization: number | null;
  staffProfessionalism: number | null;
  cleanlinessToilets: number | null;
  cleanlinessTerminal: number | null;
  issues: string[];
  staffHelpful: number | null;
  staffClear: number | null;
  overallRating: number | null;
  followUpEmail: string | null;
  createdAt: string;
}

const COLORS = [
  "#CE5605",
  "#1D9E75",
  "#378ADD",
  "#D85A30",
  "#7F77DD",
  "#D4537E",
];

// ─── Bar Component ────────────────────────────────────────────────
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

// ─── Metric Card ──────────────────────────────────────────────────
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

// ─── Main Dashboard ───────────────────────────────────────────────
export default function OwnerDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "responses">(
    "analytics",
  );
  const [loadingResponses, setLoadingResponses] = useState(false);
  const loadingRef = useRef(false);

  const loadAnalytics = useCallback(
    async (authToken: string) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      try {
        const response = await fetch("/api/surveys/analytics", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("aeropalma_token");
            router.replace("/login");
            return;
          }
          throw new Error("Failed to load analytics");
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Load analytics error:", err);
      } finally {
        loadingRef.current = false;
      }
    },
    [router],
  );

  const loadResponses = useCallback(
    async (authToken: string) => {
      setLoadingResponses(true);
      try {
        const response = await fetch("/api/surveys/responses", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("aeropalma_token");
            router.replace("/login");
            return;
          }
          throw new Error("Failed to load responses");
        }
        const data = await response.json();
        setResponses(data.responses || []);
      } catch (err) {
        console.error("Load responses error:", err);
      } finally {
        setLoadingResponses(false);
      }
    },
    [router],
  );

  // Auth guard on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("aeropalma_token");
    if (!savedToken) {
      router.replace("/login");
      return;
    }
    setToken(savedToken);
    setReady(true);
    loadAnalytics(savedToken);
    loadResponses(savedToken);
  }, [loadAnalytics, loadResponses, router]);

  // Auto-refresh analytics every 30 seconds
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => loadAnalytics(token), 30000);
    return () => clearInterval(interval);
  }, [token, loadAnalytics]);

  const handleLogout = () => {
    localStorage.removeItem("aeropalma_token");
    setToken(null);
    setAnalytics(null);
    router.replace("/login");
  };

  // Improved CSV export – each data point in its own cell, proper escaping
  const exportToCSV = () => {
    if (!responses?.length) return;

    const issueTypes = [
      "Long queues / Filas longas",
      "Unclean facilities / Instalações sujas",
      "Poor signage / Sinalização ruim",
      "Unfriendly staff / Funcionários antipáticos",
      "Delays / Atrasos",
      "No issues / Nenhum problema",
    ];

    const hasIssue = (
      responseIssues: string[] | undefined,
      issueType: string,
    ): number => {
      if (!Array.isArray(responseIssues)) return 0;

      const variants = issueType.split(" / ").map((v) => v.trim());

      return responseIssues.some((issue) => variants.includes(issue.trim()))
        ? 1
        : 0;
    };

    const sanitizeHeader = (value: string) => {
      return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s*\/\s*/g, "_")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    };

    const headers = [
      "submission_id",
      "timestamp_utc",
      "language",
      "first_time_visitor",
      "checkin_wait_time",
      "checkin_efficiency",
      "security_wait_time",
      "security_organization",
      "staff_professionalism",
      "cleanliness_toilets",
      "cleanliness_terminal",
      "staff_helpful",
      "staff_clear",
      "overall_rating",
      ...issueTypes.map(sanitizeHeader),
      "follow_up_email",
    ];

    const rows = responses.map((r) => {
      const date = new Date(Number(r.ts));

      const formattedDate = isNaN(date.getTime())
        ? ""
        : date.toISOString().slice(0, 19).replace("T", " ");

      return [
        r.id ?? "",
        formattedDate,
        r.lang ?? "",
        r.firstTime === "yes" ? 1 : r.firstTime === "no" ? 0 : "",
        r.checkinWaitTime ?? "",
        r.checkinEfficiency ?? "",
        r.securityWaitTime ?? "",
        r.securityOrganization ?? "",
        r.staffProfessionalism ?? "",
        r.cleanlinessToilets ?? "",
        r.cleanlinessTerminal ?? "",
        r.staffHelpful ?? "",
        r.staffClear ?? "",
        r.overallRating ?? "",
        ...issueTypes.map((issue) => hasIssue(r.issues, issue)),
        r.followUpEmail ?? "",
      ];
    });

    const escapeCell = (cell: unknown): string => {
      if (cell === undefined || cell === null) return "";

      const str = String(cell);

      if (str.includes(";") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }

      return str;
    };

    const csvContent = [
      headers.map(escapeCell).join(";"),
      ...rows.map((row) => row.map(escapeCell).join(";")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = `aeropalma_responses_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };
  // Blank while verifying auth
  if (!ready) {
    return <div style={{ minHeight: "100vh", background: "var(--bg)" }} />;
  }

  if (!analytics) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>Loading analytics...</p>
        </div>
      </main>
    );
  }

  const card = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
  };

  return (
    <main
      style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <TopBar
          onLogout={handleLogout}
          onRefresh={() => {
            if (token) {
              loadAnalytics(token);
              loadResponses(token);
            }
          }}
        />

        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid var(--border)",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTab("analytics")}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "analytics"
                  ? "2px solid #CE5605"
                  : "2px solid transparent",
              color:
                activeTab === "analytics" ? "#CE5605" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaChartBar /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "responses"
                  ? "2px solid #CE5605"
                  : "2px solid transparent",
              color:
                activeTab === "responses" ? "#CE5605" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaList /> Individual Responses
          </button>
        </div>

        {activeTab === "analytics" ? (
          // ─── ANALYTICS VIEW ─────────────────────────────────────────
          <>
            {/* Main KPIs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <Metric
                label="Total Responses"
                value={analytics.total.toString()}
              />
              <Metric
                label="Avg Overall Rating"
                value={analytics.overallRating.toFixed(1)}
              />
              <Metric
                label="Staff Helpful"
                value={analytics.staffHelpful.toFixed(1)}
              />
              <Metric
                label="Staff Clear"
                value={analytics.staffClear.toFixed(1)}
              />
            </div>

            {/* Rating bars */}
            <div style={card}>
              <SectionTitle>
                <FaClipboardList style={{ marginRight: "4px" }} /> Experience
                Ratings
              </SectionTitle>
              <div style={{ marginTop: "12px" }}>
                <Bar
                  label="Check-in waiting time"
                  value={analytics.ratings.checkinWaitTime}
                  color={COLORS[0]}
                />
                <Bar
                  label="Check-in efficiency"
                  value={analytics.ratings.checkinEfficiency}
                  color={COLORS[1]}
                />
                <Bar
                  label="Security waiting time"
                  value={analytics.ratings.securityWaitTime}
                  color={COLORS[2]}
                />
                <Bar
                  label="Security organization"
                  value={analytics.ratings.securityOrganization}
                  color={COLORS[3]}
                />
                <Bar
                  label="Staff professionalism"
                  value={analytics.ratings.staffProfessionalism}
                  color={COLORS[4]}
                />
                <Bar
                  label="Cleanliness (toilets)"
                  value={analytics.ratings.cleanlinessToilets}
                  color={COLORS[5]}
                />
                <Bar
                  label="Cleanliness (terminal)"
                  value={analytics.ratings.cleanlinessTerminal}
                  color={COLORS[0]}
                />
              </div>
            </div>

            {/* Issues */}
            {Object.keys(analytics.issueCounts).length > 0 && (
              <div style={card}>
                <SectionTitle>
                  <FaInbox style={{ marginRight: "4px" }} /> Reported Issues
                </SectionTitle>
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {Object.entries(analytics.issueCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([issue, count]) => (
                      <div
                        key={issue}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: "var(--bg)",
                          borderRadius: "6px",
                          fontSize: "13px",
                        }}
                      >
                        <span>{issue}</span>
                        <span
                          style={{
                            background: "#CE5605",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Language & demographics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={card}>
                <SectionTitle>
                  <FaLanguage style={{ marginRight: "4px" }} /> Languages
                </SectionTitle>
                <StatRow
                  label={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaFlagUsa /> English
                    </span>
                  }
                  count={analytics.langEn}
                  total={analytics.total}
                />
                <StatRow
                  label={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaFlag /> Português
                    </span>
                  }
                  count={analytics.langPt}
                  total={analytics.total}
                />
              </div>
              <div style={card}>
                <SectionTitle>
                  <FaUserFriends style={{ marginRight: "4px" }} /> First-time
                  Visitors
                </SectionTitle>
                <StatRow
                  label={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <BiHappy /> Yes / Sim
                    </span>
                  }
                  count={analytics.firstTimers}
                  total={analytics.total}
                />
                <StatRow
                  label={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <MdOutlineEmojiEmotions /> No / Não
                    </span>
                  }
                  count={analytics.total - analytics.firstTimers}
                  total={analytics.total}
                />
              </div>
            </div>
          </>
        ) : (
          // ─── INDIVIDUAL RESPONSES VIEW ──────────────────────────────
          <div style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <SectionTitle>
                <FaList style={{ marginRight: "4px" }} /> All Submissions (
                {responses.length})
              </SectionTitle>
              <button
                onClick={exportToCSV}
                disabled={responses.length === 0}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  cursor: responses.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                }}
              >
                <FaDownload /> Export CSV
              </button>
            </div>

            {loadingResponses ? (
              <p
                style={{ textAlign: "center", color: "var(--text-secondary)" }}
              >
                Loading responses...
              </p>
            ) : responses.length === 0 ? (
              <p
                style={{ textAlign: "center", color: "var(--text-secondary)" }}
              >
                No survey responses yet.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border)",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "12px 8px" }}>Date</th>
                      <th style={{ padding: "12px 8px" }}>Lang</th>
                      <th style={{ padding: "12px 8px" }}>First Time</th>
                      <th style={{ padding: "12px 8px" }}>Check-in Wait</th>
                      <th style={{ padding: "12px 8px" }}>Security Wait</th>
                      <th style={{ padding: "12px 8px" }}>Staff Prof.</th>
                      <th style={{ padding: "12px 8px" }}>Overall</th>
                      <th style={{ padding: "12px 8px" }}>Issues</th>
                      <th style={{ padding: "12px 8px" }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response) => (
                      <tr
                        key={response.id}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--bg-hover)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{ padding: "12px 8px", whiteSpace: "nowrap" }}
                        >
                          {new Date(parseInt(response.ts)).toLocaleString()}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {response.lang.toUpperCase()}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {response.firstTime === "yes"
                            ? "✅ Yes"
                            : response.firstTime === "no"
                              ? "❌ No"
                              : "—"}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {response.checkinWaitTime ?? "—"}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {response.securityWaitTime ?? "—"}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {response.staffProfessionalism ?? "—"}
                        </td>
                        <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                          {response.overallRating ?? "—"}
                        </td>
                        <td style={{ padding: "12px 8px", maxWidth: "200px" }}>
                          {response.issues.length > 0
                            ? response.issues.slice(0, 2).join(", ") +
                              (response.issues.length > 2 ? "…" : "")
                            : "—"}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          {response.followUpEmail ? (
                            <a
                              href={`mailto:${response.followUpEmail}`}
                              style={{
                                color: "#CE5605",
                                textDecoration: "none",
                              }}
                            >
                              {response.followUpEmail}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
