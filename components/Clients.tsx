"use client";
import { useTranslations } from "@/i18n";

export default function Clients() {
  const t = useTranslations("clients");

  return (
    <section
      id="clients"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "48px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 40px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "clamp(32px, 6vw, 80px)",
          }}
        >
          {/* Trusted By Label */}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
            }}
          >
            {t("label")}
          </span>

          {/* TotalEnergies Logo - SVG */}
          <img
            src="/clients/total.svg"
            alt="TotalEnergies"
            style={{
              height: "52px",
              width: "auto",
              maxWidth: "190px",
              objectFit: "contain",
            }}
          />

          {/* ExxonMobil Logo - PNG */}
          <img
            src="/clients/exxon.png"
            alt="ExxonMobil"
            style={{
              height: "48px",
              width: "auto",
              maxWidth: "170px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          img {
            height: 42px !important;
          }
        }
      `}</style>
    </section>
  );
}
