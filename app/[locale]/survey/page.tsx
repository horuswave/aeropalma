"use client";
import { useState } from "react";

// ─── Storage key (must match dashboard) ──────────────────────────
const STORE_KEY = "aeropalma_responses";

// ─── Translations ──────────────────────────────────────────────
const TEXTS = {
  en: {
    title: "Airport Passenger Experience Survey",
    subtitle:
      "Thank you for flying through Afungi Airport. This survey takes less than 2 minutes and helps us improve our services.",
    q1: "First time using this airport?",
    yes: "Yes",
    no: "No",
    q2: "Rate your experience",
    ratingScale: "1 = Very Poor · 5 = Excellent",
    q3: "Did you experience any of the following?",
    q4: "Staff were helpful and available",
    q4b: "Staff communicated clearly",
    q5: "Overall rating of the airport",
    q6: "What did you like most about your experience?",
    q7: "What is the ONE thing we should improve immediately?",
    q8: "Additional comments",
    submit: "Submit via WhatsApp",
    privacy:
      "Your phone number is not recorded. The response is sent privately to AeroPalma only.",
    thanksTitle: "Thank You!",
    thanksBody:
      "WhatsApp has been opened with your response. We appreciate your feedback.",
    newResponse: "New Response",
    ratingAreas: [
      "Check-in waiting time",
      "Check-in efficiency",
      "Security waiting time",
      "Security organization",
      "Staff professionalism",
      "Cleanliness (toilets)",
      "Cleanliness (terminal)",
      "Seating availability",
      "Temperature / comfort",
      "Wi-Fi quality",
      "Baggage waiting time",
    ],
    issues: [
      "Long queues",
      "Unclean facilities",
      "Poor signage",
      "Unfriendly staff",
      "Delays",
      "No issues",
    ],
  },
  pt: {
    title: "Pesquisa de Experiência do Passageiro",
    subtitle:
      "Obrigado por voar pelo Aeroporto de Afungi. Esta pesquisa leva menos de 2 minutos e ajuda-nos a melhorar os nossos serviços.",
    q1: "É a primeira vez que usa este aeroporto?",
    yes: "Sim",
    no: "Não",
    q2: "Avalie a sua experiência",
    ratingScale: "1 = Muito Mau · 5 = Excelente",
    q3: "Experienciou algum dos seguintes problemas?",
    q4: "Os funcionários foram prestativos e disponíveis",
    q4b: "A equipa comunicou de forma clara",
    q5: "Avaliação geral do aeroporto",
    q6: "O que mais gostou na sua experiência?",
    q7: "O que devemos melhorar imediatamente?",
    q8: "Comentários adicionais",
    submit: "Enviar via WhatsApp",
    privacy:
      "O seu número de telefone não é registado. A resposta é enviada privativamente apenas para a AeroPalma.",
    thanksTitle: "Obrigado!",
    thanksBody:
      "O WhatsApp foi aberto com a sua resposta. Agradecemos o seu feedback.",
    newResponse: "Nova Resposta",
    ratingAreas: [
      "Tempo de espera no check-in",
      "Eficiência do check-in",
      "Tempo de espera na segurança",
      "Organização da segurança",
      "Profissionalismo da equipa",
      "Limpeza (banheiros)",
      "Limpeza (terminal)",
      "Disponibilidade de assentos",
      "Temperatura / conforto",
      "Qualidade do Wi-Fi",
      "Tempo de espera da bagagem",
    ],
    issues: [
      "Filas longas",
      "Instalações sujas",
      "Sinalização má",
      "Funcionários antipáticos",
      "Atrasos",
      "Nenhum problema",
    ],
  },
};

// ─── Persist one completed response to localStorage ───────────────
function saveResponse(data: {
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
}) {
  try {
    const existing: unknown[] = JSON.parse(
      localStorage.getItem(STORE_KEY) ?? "[]",
    );
    existing.push({ ...data, ts: Date.now() });
    // Keep only the last 1 000 responses to avoid storage limits
    const trimmed = existing.slice(-1000);
    localStorage.setItem(STORE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage may be unavailable (private browsing, etc.) — fail silently
  }
}

// ─── RatingRow Component ───────────────────────────────────────
function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "14px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          minWidth: "200px",
          flex: "1 1 180px",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: `1px solid ${value >= n ? "#CE5605" : "var(--border)"}`,
              background: value >= n ? "#CE5605" : "var(--card-bg)",
              color: value >= n ? "#fff" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Survey Page ─────────────────────────────────────────
export default function SurveyPage() {
  const [lang, setLang] = useState<"en" | "pt" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [firstTime, setFirstTime] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [issues, setIssues] = useState<Set<string>>(new Set());
  const [staffHelpful, setStaffHelpful] = useState(0);
  const [staffClear, setStaffClear] = useState(0);
  const [overall, setOverall] = useState(0);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [comments, setComments] = useState("");

  const t = lang ? TEXTS[lang] : null;

  const toggleIssue = (iss: string) => {
    setIssues((prev) => {
      const next = new Set(prev);
      if (next.has(iss)) next.delete(iss);
      else next.add(iss);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!t || !lang) return;

    const ratingsText = Object.entries(ratings)
      .map(([k, v]) => `  ${k}: ${v}/5`)
      .join("\n");
    const issuesText = issues.size ? [...issues].join(", ") : "None";

    const msg =
      `*AeroPalma — Passenger Survey (${lang.toUpperCase()})*\n\n` +
      `First visit: ${firstTime ?? "N/A"}\n\n` +
      `*Ratings:*\n${ratingsText || "  (not completed)"}\n\n` +
      `Staff helpful: ${staffHelpful || "N/A"}/5\n` +
      `Staff communication: ${staffClear || "N/A"}/5\n\n` +
      `*Overall:* ${overall || "N/A"}/5\n\n` +
      `*Issues:* ${issuesText}\n\n` +
      (liked ? `*Liked:* ${liked}\n` : "") +
      (improve ? `*Improve:* ${improve}\n` : "") +
      (comments ? `*Comments:* ${comments}\n` : "");

    // ── Save to localStorage before opening WhatsApp ──────────
    saveResponse({
      lang,
      firstTime,
      ratings,
      issues: [...issues],
      staffHelpful,
      staffClear,
      overall,
      liked,
      improve,
      comments,
    });

    window.open(
      "https://wa.me/258855651603?text=" + encodeURIComponent(msg),
      "_blank",
    );
    setSubmitted(true);
  };

  const reset = () => {
    setLang(null);
    setSubmitted(false);
    setFirstTime(null);
    setRatings({});
    setIssues(new Set());
    setStaffHelpful(0);
    setStaffClear(0);
    setOverall(0);
    setLiked("");
    setImprove("");
    setComments("");
  };

  const card: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "clamp(20px, 4vw, 32px)",
    marginBottom: "20px",
  };

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "10px",
  };

  const field: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--input-bg)",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontFamily: "inherit",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "clamp(16px, 4vw, 48px) clamp(16px, 5vw, 24px)",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* Language selector */}
        {!lang && !submitted && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                letterSpacing: "-2px",
              }}
            >
              ✈️
            </div>
            <h1
              style={{
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "10px",
                letterSpacing: "-0.03em",
              }}
            >
              Afungi Airport
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                marginBottom: "36px",
              }}
            >
              Choose your language / Escolha o seu idioma
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {(["en", "pt"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  style={{
                    padding: "24px 40px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minWidth: "160px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#CE5605";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "10px" }}>
                    {l === "en" ? "🇬🇧" : "🇲🇿"}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                    }}
                  >
                    {l === "en" ? "English" : "Português"}
                  </div>
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                marginTop: "32px",
              }}
            >
              🔒 Anonymous · Responses go directly to AeroPalma
            </p>
          </div>
        )}

        {/* Thank you screen */}
        {submitted && t && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "#CE5605",
                marginBottom: "12px",
              }}
            >
              {t.thanksTitle}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                maxWidth: "400px",
                margin: "0 auto 32px",
              }}
            >
              {t.thanksBody}
            </p>
            <button onClick={reset} className="btn-orange">
              {t.newResponse}
            </button>
          </div>
        )}

        {/* Survey form */}
        {lang && !submitted && t && (
          <form onSubmit={handleSubmit}>
            <h1
              style={{
                fontSize: "clamp(20px, 3.5vw, 28px)",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: "10px",
                letterSpacing: "-0.02em",
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "32px",
                lineHeight: 1.6,
              }}
            >
              {t.subtitle}
            </p>

            {/* Q1 */}
            <div style={card}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                {t.q1}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {[t.yes, t.no].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFirstTime(opt)}
                    style={{
                      padding: "10px 28px",
                      borderRadius: "40px",
                      border: `1px solid ${
                        firstTime === opt ? "#CE5605" : "var(--border)"
                      }`,
                      background:
                        firstTime === opt ? "#CE5605" : "var(--card-bg)",
                      color: firstTime === opt ? "#fff" : "var(--text-primary)",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      fontSize: "14px",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 ratings */}
            <div style={card}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                {t.q2}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginBottom: "20px",
                }}
              >
                {t.ratingScale}
              </p>
              {t.ratingAreas.map((area) => (
                <RatingRow
                  key={area}
                  label={area}
                  value={ratings[area] || 0}
                  onChange={(v) => setRatings((p) => ({ ...p, [area]: v }))}
                />
              ))}
            </div>

            {/* Q3 issues */}
            <div style={card}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                {t.q3}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {t.issues.map((iss) => (
                  <button
                    key={iss}
                    type="button"
                    onClick={() => toggleIssue(iss)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "40px",
                      border: `1px solid ${
                        issues.has(iss) ? "#CE5605" : "var(--border)"
                      }`,
                      background: issues.has(iss)
                        ? "rgba(206,86,5,0.1)"
                        : "var(--card-bg)",
                      color: issues.has(iss)
                        ? "#CE5605"
                        : "var(--text-secondary)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      fontSize: "13px",
                    }}
                  >
                    {iss}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4 staff */}
            <div style={card}>
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                  }}
                >
                  {t.q4}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStaffHelpful(n)}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        border: `1px solid ${
                          staffHelpful >= n ? "#CE5605" : "var(--border)"
                        }`,
                        background:
                          staffHelpful >= n ? "#CE5605" : "var(--card-bg)",
                        color:
                          staffHelpful >= n ? "#fff" : "var(--text-secondary)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "12px",
                  }}
                >
                  {t.q4b}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStaffClear(n)}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        border: `1px solid ${
                          staffClear >= n ? "#CE5605" : "var(--border)"
                        }`,
                        background:
                          staffClear >= n ? "#CE5605" : "var(--card-bg)",
                        color:
                          staffClear >= n ? "#fff" : "var(--text-secondary)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Q5 overall */}
            <div style={card}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                {t.q5}
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setOverall(n)}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      border: `1px solid ${
                        overall >= n ? "#CE5605" : "var(--border)"
                      }`,
                      background: overall >= n ? "#CE5605" : "var(--card-bg)",
                      color: overall >= n ? "#fff" : "var(--text-secondary)",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "16px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Q6–Q8 text */}
            <div style={card}>
              <div style={{ marginBottom: "20px" }}>
                <label style={lbl}>{t.q6}</label>
                <textarea
                  value={liked}
                  onChange={(e) => setLiked(e.target.value)}
                  rows={2}
                  style={{ ...field, resize: "vertical" }}
                  placeholder="…"
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={lbl}>{t.q7}</label>
                <textarea
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                  rows={2}
                  style={{ ...field, resize: "vertical" }}
                  placeholder="…"
                />
              </div>
              <div>
                <label style={lbl}>{t.q8}</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={2}
                  style={{ ...field, resize: "vertical" }}
                  placeholder="…"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-orange"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              {t.submit}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "var(--text-secondary)",
                marginTop: "12px",
              }}
            >
              🔒 {t.privacy}
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        input:focus,
        textarea:focus {
          border-color: #ce5605 !important;
        }
      `}</style>
    </main>
  );
}
