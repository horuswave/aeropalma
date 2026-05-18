"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTrash } from "react-icons/fa";

// ─── Types ─────────────────────────────────────────────────────────────
interface SurveyFormData {
  lang: "en" | "pt";
  firstTime: "yes" | "no" | null;
  ratings: {
    checkinWaitTime: number;
    checkinEfficiency: number;
    securityWaitTime: number;
    securityOrganization: number;
    staffProfessionalism: number;
    cleanlinessToilets: number;
    cleanlinessTerminal: number;
  };
  issues: string[];
  staffHelpful: number | null;
  staffClear: number | null;
  overallRating: number | null;
  followUpEmail?: string | null;
}

// ─── Translations ─────────────────────────────────────────────────────
const EN = {
  surveyTitle: "Airport Passenger Experience Survey",
  subtitle:
    "Thank you for traveling through our airport. This survey takes less than 2 minutes and helps us improve our services.",
  firstTimeQuestion: "First time using this airport? *",
  yes: "Yes",
  no: "No",
  ratingScale: "1 = Very Poor · 5 = Excellent",
  checkinWait: "Check-in waiting time *",
  checkinEfficiency: "Check-in efficiency *",
  securityWait: "Security waiting time *",
  securityOrganization: "Security organization *",
  staffProfessional: "Staff professionalism *",
  cleanlinessToilets: "Cleanliness (toilets) *",
  cleanlinessTerminal: "Cleanliness (terminal) *",
  issuesQuestion: "Did you experience any of the following? *",
  issueOptions: [
    "Long queues",
    "Unclean facilities",
    "Poor signage",
    "Unfriendly staff",
    "Delays",
    "No issues",
  ],
  staffHelpfulQuestion: "Staff were helpful and available *",
  staffClearQuestion: "Staff communicated clearly *",
  overallRatingQuestion: "Overall rating of the airport *",
  followUpLabel: "Email for follow-up (optional)",
  followUpPlaceholder: "your@email.com",
  followUpNote: "We'll only use this to respond to your feedback. No spam.",
  thankYouFooter: "Thank you for your feedback!",
  qualitySafety: "QUALITY & SAFETY",
  submit: "Submit Survey",
  submitting: "Submitting...",
  clearForm: "Clear Form",
  validationError: "Please complete all required fields.",
  submitError: "Failed to submit survey. Please try again.",
  thankYou: "Thank You!",
  successMessage: "Your feedback has been recorded. Have a great flight!",
  newResponse: "New Response",
  privacy:
    "Your response is anonymous and sent securely. Only AeroPalma sees your feedback.",
  errorFirstTime: "Please select an option.",
  errorRatings: "Please rate all 7 items above.",
  errorIssues: 'Please select at least one issue (or "No issues").',
  errorStaffHelpful: "Please rate this item.",
  errorStaffClear: "Please rate this item.",
  errorOverallRating: "Please select an overall rating.",
  summaryFirstTime: "First time question",
  summaryRatings: "All rating questions",
  summaryIssues: "Issues selection",
  summaryStaffHelpful: "Staff helpfulness rating",
  summaryStaffClear: "Staff clarity rating",
  summaryOverallRating: "Overall rating",
};

const PT = {
  surveyTitle: "Pesquisa de Experiência do Passageiro no Aeroporto",
  subtitle:
    "Obrigado por viajar através do nosso aeroporto. Esta pesquisa leva menos de 2 minutos e nos ajuda a melhorar nossos serviços.",
  firstTimeQuestion: "É primeira vez que usa este aeroporto? *",
  yes: "Sim",
  no: "Não",
  ratingScale: "1 = Péssimo · 5 = Excelente",
  checkinWait: "Tempo de espera no check-in *",
  checkinEfficiency: "Eficiência do check-in *",
  securityWait: "Tempo de espera na segurança *",
  securityOrganization: "Organização da segurança *",
  staffProfessional: "Profissionalismo da equipe *",
  cleanlinessToilets: "Limpeza (banheiros) *",
  cleanlinessTerminal: "Limpeza (terminal) *",
  issuesQuestion: "Você experimentou algum dos seguintes? *",
  issueOptions: [
    "Filas longas",
    "Instalações sujas",
    "Sinalização ruim",
    "Funcionários antipáticos",
    "Atrasos",
    "Nenhum problema",
  ],
  staffHelpfulQuestion: "Os funcionários foram prestativos e disponíveis *",
  staffClearQuestion: "A equipe se comunicou claramente *",
  overallRatingQuestion: "Avaliação geral do aeroporto *",
  followUpLabel: "E-mail para acompanhamento (opcional)",
  followUpPlaceholder: "seu@email.com",
  followUpNote: "Usaremos apenas para responder ao seu feedback. Sem spam.",
  thankYouFooter: "Obrigado pelo seu feedback!",
  qualitySafety: "QUALIDADE & SEGURANÇA",
  submit: "Enviar Pesquisa",
  submitting: "Enviando...",
  clearForm: "Limpar Formulário",
  validationError: "Por favor, complete todos os campos obrigatórios.",
  submitError: "Falha ao enviar pesquisa. Por favor, tente novamente.",
  thankYou: "Obrigado!",
  successMessage: "Seu feedback foi registrado. Tenha um ótimo voo!",
  newResponse: "Nova Resposta",
  privacy:
    "A sua resposta é anónima e enviada com segurança. Apenas a AeroPalma vê o seu feedback.",
  errorFirstTime: "Por favor, selecione uma opção.",
  errorRatings: "Por favor, avalie todos os 7 itens acima.",
  errorIssues:
    'Por favor, selecione pelo menos um problema (ou "Nenhum problema").',
  errorStaffHelpful: "Por favor, avalie este item.",
  errorStaffClear: "Por favor, avalie este item.",
  errorOverallRating: "Por favor, selecione uma avaliação geral.",
  summaryFirstTime: "Pergunta da primeira vez",
  summaryRatings: "Todas as perguntas de avaliação",
  summaryIssues: "Seleção de problemas",
  summaryStaffHelpful: "Avaliação da prestatividade da equipe",
  summaryStaffClear: "Avaliação da clareza da equipe",
  summaryOverallRating: "Avaliação geral",
};

// ─── RatingRow Component ──────────────────────────────────────────────
function RatingRow({
  label,
  value,
  onChange,
  hasError,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hasError?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          minWidth: "180px",
          flex: "1 1 180px",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              border: `1px solid ${
                value === rating
                  ? "#CE5605"
                  : hasError && value === 0
                    ? "#e53e3e"
                    : "var(--border)"
              }`,
              background: value === rating ? "#CE5605" : "var(--card-bg)",
              color: value === rating ? "#fff" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
const STORAGE_KEY = "aeropalma_survey_progress";

export default function SurveyPage() {
  const [lang, setLang] = useState<"en" | "pt" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstTime, setFirstTime] = useState<"yes" | "no" | null>(null);
  const [ratings, setRatings] = useState({
    checkinWaitTime: 0,
    checkinEfficiency: 0,
    securityWaitTime: 0,
    securityOrganization: 0,
    staffProfessionalism: 0,
    cleanlinessToilets: 0,
    cleanlinessTerminal: 0,
  });
  const [issues, setIssues] = useState<string[]>([]);
  const [staffHelpful, setStaffHelpful] = useState<number | null>(null);
  const [staffClear, setStaffClear] = useState<number | null>(null);
  const [overallRating, setOverallRating] = useState<number | null>(null);
  const [followUpEmail, setFollowUpEmail] = useState("");
  const [missingFields, setMissingFields] = useState<{
    firstTime?: boolean;
    ratings?: boolean;
    issues?: boolean;
    staffHelpful?: boolean;
    staffClear?: boolean;
    overallRating?: boolean;
  }>({});

  // Load saved progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.lang) setLang(data.lang);
        if (data.firstTime) setFirstTime(data.firstTime);
        if (data.ratings) setRatings(data.ratings);
        if (data.issues) setIssues(data.issues);
        if (data.staffHelpful !== undefined) setStaffHelpful(data.staffHelpful);
        if (data.staffClear !== undefined) setStaffClear(data.staffClear);
        if (data.overallRating !== undefined)
          setOverallRating(data.overallRating);
        if (data.followUpEmail !== undefined)
          setFollowUpEmail(data.followUpEmail);
      } catch (e) {
        console.error("Failed to restore survey progress:", e);
      }
    }
  }, []);

  // Save progress to localStorage whenever relevant state changes
  useEffect(() => {
    if (lang === null) return;
    const progress = {
      lang,
      firstTime,
      ratings,
      issues,
      staffHelpful,
      staffClear,
      overallRating,
      followUpEmail,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [
    lang,
    firstTime,
    ratings,
    issues,
    staffHelpful,
    staffClear,
    overallRating,
    followUpEmail,
  ]);

  const t = lang === "en" ? EN : PT;

  const handleIssueToggle = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue],
    );
    if (missingFields.issues) {
      setMissingFields((prev) => ({ ...prev, issues: false }));
    }
  };

  // Clear the form AND reset language (go back to language selection)
  const clearForm = () => {
    setLang(null); // go back to language selector
    setFirstTime(null);
    setRatings({
      checkinWaitTime: 0,
      checkinEfficiency: 0,
      securityWaitTime: 0,
      securityOrganization: 0,
      staffProfessionalism: 0,
      cleanlinessToilets: 0,
      cleanlinessTerminal: 0,
    });
    setIssues([]);
    setStaffHelpful(null);
    setStaffClear(null);
    setOverallRating(null);
    setFollowUpEmail("");
    setMissingFields({});
    setError("");
    setSubmitted(false);
    setLoading(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Reset after successful submission (keeps same behaviour)
  const resetForm = () => {
    setLang(null);
    setSubmitted(false);
    setLoading(false);
    setError("");
    setFirstTime(null);
    setRatings({
      checkinWaitTime: 0,
      checkinEfficiency: 0,
      securityWaitTime: 0,
      securityOrganization: 0,
      staffProfessionalism: 0,
      cleanlinessToilets: 0,
      cleanlinessTerminal: 0,
    });
    setIssues([]);
    setStaffHelpful(null);
    setStaffClear(null);
    setOverallRating(null);
    setFollowUpEmail("");
    setMissingFields({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const validateForm = () => {
    const missing: typeof missingFields = {};
    if (!firstTime) missing.firstTime = true;
    if (Object.values(ratings).some((r) => r === 0)) missing.ratings = true;
    if (issues.length === 0) missing.issues = true;
    if (!staffHelpful) missing.staffHelpful = true;
    if (!staffClear) missing.staffClear = true;
    if (!overallRating) missing.overallRating = true;
    setMissingFields(missing);
    return Object.keys(missing).length === 0;
  };

  const handleSubmitSurvey = async () => {
    const isValid = validateForm();
    if (!isValid) {
      setError(t.validationError);
      const firstErrorId = Object.keys(missingFields).find(
        (key) => missingFields[key as keyof typeof missingFields],
      );
      if (firstErrorId) {
        const element = document.getElementById(`error-${firstErrorId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    setError("");

    const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID || "OWNER_ID_HERE";
    if (OWNER_ID === "OWNER_ID_HERE") {
      console.warn(
        "⚠️ Warning: NEXT_PUBLIC_OWNER_ID is not configured. Survey will not be saved.",
      );
    }

    const formData: SurveyFormData = {
      lang: lang!,
      firstTime,
      ratings,
      issues,
      staffHelpful,
      staffClear,
      overallRating,
      followUpEmail: followUpEmail.trim() || null,
    };

    try {
      const response = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: OWNER_ID,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error(t.submitError);

      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.submitError);
      console.error("Survey submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── LANGUAGE SELECTOR ───────────────────────────────────────────────
  if (!lang && !submitted) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          padding: "clamp(16px, 4vw, 48px) clamp(16px, 5vw, 24px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <img
              src="/logo.svg"
              alt="AeroPalma"
              style={{ height: "72px", width: "auto" }}
            />
          </div>
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
            <button
              type="button"
              onClick={() => setLang("en")}
              style={{
                padding: "24px 40px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "160px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                English
              </div>
            </button>
            <button
              type="button"
              onClick={() => setLang("pt")}
              style={{
                padding: "24px 40px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                minWidth: "160px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                Português
              </div>
            </button>
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
      </main>
    );
  }

  // ─── SUCCESS SCREEN ─────────────────────────────────────────────────
  if (submitted && t) {
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
            textAlign: "center",
            maxWidth: "400px",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "40px 32px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              animation: "bounce 0.6s ease-in-out",
            }}
          >
            <FaCheckCircle color="#1D9E75" />
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "12px",
              color: "var(--text-primary)",
            }}
          >
            {t.thankYou}
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            {t.successMessage}
          </p>
          <button
            onClick={resetForm}
            style={{
              background: "#CE5605",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.newResponse}
          </button>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </main>
    );
  }

  if (!t) return null;

  const cardStyle: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "clamp(20px, 4vw, 32px)",
    marginBottom: "20px",
  };

  const errorBorderStyle: React.CSSProperties = {
    border: "1px solid #e53e3e",
    background: "rgba(229, 62, 62, 0.02)",
  };

  // ─── SURVEY FORM ─────────────────────────────────────────────────────
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "clamp(16px, 4vw, 48px) clamp(16px, 5vw, 24px)",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <img
            src="/logo.svg"
            alt="AeroPalma"
            style={{ height: "60px", width: "auto" }}
          />
        </div>

        <h1
          style={{
            fontSize: "clamp(20px, 3.5vw, 28px)",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: "10px",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          {t.surveyTitle}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "32px",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          {t.subtitle}
        </p>

        {error && (
          <div
            style={{
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              padding: "12px 14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaExclamationCircle color="#e53e3e" size={16} />
            <span style={{ fontSize: "13px", color: "#c53030" }}>
              {error}
              {missingFields && Object.keys(missingFields).length > 0 && (
                <ul style={{ margin: "4px 0 0 20px", fontSize: "12px" }}>
                  {missingFields.firstTime && <li>{t.summaryFirstTime}</li>}
                  {missingFields.ratings && <li>{t.summaryRatings}</li>}
                  {missingFields.issues && <li>{t.summaryIssues}</li>}
                  {missingFields.staffHelpful && (
                    <li>{t.summaryStaffHelpful}</li>
                  )}
                  {missingFields.staffClear && <li>{t.summaryStaffClear}</li>}
                  {missingFields.overallRating && (
                    <li>{t.summaryOverallRating}</li>
                  )}
                </ul>
              )}
            </span>
          </div>
        )}

        {/* 1. YOUR JOURNEY */}
        <div
          style={{
            ...cardStyle,
            ...(missingFields.firstTime ? errorBorderStyle : {}),
          }}
          id="error-firstTime"
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "14px",
            }}
          >
            {t.firstTimeQuestion}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {[t.yes, t.no].map((opt) => {
              const value = opt === t.yes ? "yes" : "no";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setFirstTime(value as "yes" | "no");
                    if (missingFields.firstTime)
                      setMissingFields((prev) => ({
                        ...prev,
                        firstTime: false,
                      }));
                  }}
                  style={{
                    padding: "10px 28px",
                    borderRadius: "40px",
                    border: `1px solid ${
                      firstTime === value ? "#CE5605" : "var(--border)"
                    }`,
                    background:
                      firstTime === value ? "#CE5605" : "var(--card-bg)",
                    color: firstTime === value ? "#fff" : "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.15s ease",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {missingFields.firstTime && (
            <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "8px" }}>
              {t.errorFirstTime}
            </p>
          )}
        </div>

        {/* 2. RATE YOUR EXPERIENCE */}
        <div
          style={{
            ...cardStyle,
            ...(missingFields.ratings ? errorBorderStyle : {}),
          }}
          id="error-ratings"
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            Rate your experience
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
          <RatingRow
            label={t.checkinWait}
            value={ratings.checkinWaitTime}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, checkinWaitTime: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={missingFields.ratings && ratings.checkinWaitTime === 0}
          />
          <RatingRow
            label={t.checkinEfficiency}
            value={ratings.checkinEfficiency}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, checkinEfficiency: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={missingFields.ratings && ratings.checkinEfficiency === 0}
          />
          <RatingRow
            label={t.securityWait}
            value={ratings.securityWaitTime}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, securityWaitTime: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={missingFields.ratings && ratings.securityWaitTime === 0}
          />
          <RatingRow
            label={t.securityOrganization}
            value={ratings.securityOrganization}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, securityOrganization: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={
              missingFields.ratings && ratings.securityOrganization === 0
            }
          />
          <RatingRow
            label={t.staffProfessional}
            value={ratings.staffProfessionalism}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, staffProfessionalism: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={
              missingFields.ratings && ratings.staffProfessionalism === 0
            }
          />
          <RatingRow
            label={t.cleanlinessToilets}
            value={ratings.cleanlinessToilets}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, cleanlinessToilets: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={missingFields.ratings && ratings.cleanlinessToilets === 0}
          />
          <RatingRow
            label={t.cleanlinessTerminal}
            value={ratings.cleanlinessTerminal}
            onChange={(v) => {
              setRatings((prev) => ({ ...prev, cleanlinessTerminal: v }));
              if (missingFields.ratings)
                setMissingFields((prev) => ({ ...prev, ratings: false }));
            }}
            hasError={
              missingFields.ratings && ratings.cleanlinessTerminal === 0
            }
          />
          {missingFields.ratings && (
            <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "8px" }}>
              {t.errorRatings}
            </p>
          )}
        </div>

        {/* 3. ISSUES EXPERIENCED */}
        <div
          style={{
            ...cardStyle,
            ...(missingFields.issues ? errorBorderStyle : {}),
          }}
          id="error-issues"
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "14px",
            }}
          >
            {t.issuesQuestion}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {t.issueOptions.map((issue) => (
              <button
                key={issue}
                type="button"
                onClick={() => handleIssueToggle(issue)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "40px",
                  border: `1px solid ${
                    issues.includes(issue) ? "#CE5605" : "var(--border)"
                  }`,
                  background: issues.includes(issue)
                    ? "rgba(206,86,5,0.1)"
                    : "var(--card-bg)",
                  color: issues.includes(issue)
                    ? "#CE5605"
                    : "var(--text-secondary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "all 0.15s ease",
                }}
              >
                {issue}
              </button>
            ))}
          </div>
          {missingFields.issues && (
            <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "8px" }}>
              {t.errorIssues}
            </p>
          )}
        </div>

        {/* 4. STAFF EXPERIENCE */}
        <div
          style={{
            ...cardStyle,
            ...(missingFields.staffHelpful || missingFields.staffClear
              ? errorBorderStyle
              : {}),
          }}
          id="error-staffHelpful"
        >
          <div style={{ marginBottom: "24px" }}>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              {t.staffHelpfulQuestion}
            </p>
            <RatingRow
              label=""
              value={staffHelpful || 0}
              onChange={(v) => {
                setStaffHelpful(v);
                if (missingFields.staffHelpful)
                  setMissingFields((prev) => ({
                    ...prev,
                    staffHelpful: false,
                  }));
              }}
              hasError={missingFields.staffHelpful && !staffHelpful}
            />
            {missingFields.staffHelpful && (
              <p
                style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}
              >
                {t.errorStaffHelpful}
              </p>
            )}
          </div>
          <div id="error-staffClear">
            <p
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "12px",
              }}
            >
              {t.staffClearQuestion}
            </p>
            <RatingRow
              label=""
              value={staffClear || 0}
              onChange={(v) => {
                setStaffClear(v);
                if (missingFields.staffClear)
                  setMissingFields((prev) => ({ ...prev, staffClear: false }));
              }}
              hasError={missingFields.staffClear && !staffClear}
            />
            {missingFields.staffClear && (
              <p
                style={{ color: "#e53e3e", fontSize: "12px", marginTop: "4px" }}
              >
                {t.errorStaffClear}
              </p>
            )}
          </div>
        </div>

        {/* 5. OVERALL EXPERIENCE */}
        <div
          style={{
            ...cardStyle,
            ...(missingFields.overallRating ? errorBorderStyle : {}),
          }}
          id="error-overallRating"
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "14px",
            }}
          >
            {t.overallRatingQuestion}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setOverallRating(n);
                  if (missingFields.overallRating)
                    setMissingFields((prev) => ({
                      ...prev,
                      overallRating: false,
                    }));
                }}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "10px",
                  border: `2px solid ${
                    overallRating === n ? "#CE5605" : "var(--border)"
                  }`,
                  background:
                    overallRating === n ? "#CE5605" : "var(--card-bg)",
                  color: overallRating === n ? "#fff" : "var(--text-secondary)",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "18px",
                  transition: "all 0.15s ease",
                }}
              >
                {n}
              </button>
            ))}
          </div>
          {missingFields.overallRating && (
            <p style={{ color: "#e53e3e", fontSize: "12px", marginTop: "8px" }}>
              {t.errorOverallRating}
            </p>
          )}
        </div>

        {/* 6. OPTIONAL FOLLOW-UP EMAIL */}
        <div style={cardStyle}>
          <label
            htmlFor="followUpEmail"
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "8px",
              display: "block",
            }}
          >
            {t.followUpLabel}
          </label>
          <input
            id="followUpEmail"
            type="email"
            value={followUpEmail}
            onChange={(e) => setFollowUpEmail(e.target.value)}
            placeholder={t.followUpPlaceholder}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-primary)",
              fontSize: "14px",
            }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            {t.followUpNote}
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          {t.thankYouFooter}
        </p>

        {/* Action Buttons: Clear + Submit */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={clearForm}
            disabled={loading}
            style={{
              flex: "1 1 auto",
              background: loading ? "#ccc" : "var(--card-bg)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              padding: "14px 20px",
              borderRadius: "40px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = "#e53e3e";
                e.currentTarget.style.color = "#e53e3e";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
          >
            <FaTrash size={14} />
            {t.clearForm}
          </button>

          <button
            onClick={handleSubmitSurvey}
            disabled={loading}
            style={{
              flex: "2 1 auto",
              background: loading ? "#ccc" : "#CE5605",
              color: "#fff",
              border: "none",
              padding: "14px 20px",
              borderRadius: "40px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          <img
            src="/quality-safety-icon.png"
            alt="Quality & Safety"
            style={{ height: "28px", width: "auto" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1px",
              color: "var(--text-secondary)",
            }}
          >
            {t.qualitySafety}
          </span>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "11px",
            color: "var(--text-secondary)",
            marginTop: "8px",
          }}
        >
          🔒 {t.privacy}
        </p>
      </div>
    </main>
  );
}
