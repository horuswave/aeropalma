"use client";
import { useTranslations } from "@/i18n";

export default function Clients() {
  const t = useTranslations("clients");

  return (
    <section id="clients" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 40px)" }}>
        <div className="clients-inner" style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 4vw, 48px)", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
            {t("label")}
          </span>
          <div className="clients-divider" style={{ width: "1px", height: "32px", background: "var(--border)" }} />
          {["TotalEnergies", "ExxonMobil"].map((name) => (
            <div key={name} className="client-logo">{name}</div>
          ))}
          <div className="clients-tagline" style={{ flex: 1, textAlign: "right", minWidth: "200px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontStyle: "italic" }}>
              {t("tagline")}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .clients-divider { display: none; }
          .clients-tagline { flex: none; width: 100%; text-align: center !important; }
        }
      `}</style>
    </section>
  );
}
