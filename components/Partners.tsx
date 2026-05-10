"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

// Map partner name prefixes to their logo files in /public/partners/
const LOGO_MAP: Record<string, string> = {
  EDM: "/partners/edm.png",
  INAM: "/partners/INAM.png",
  Petromoc: "/partners/petromoc.png",
  ICAO: "/partners/ICAO.png",
  IACM: "/partners/IACM.jpg",
};

function PartnerLogo({ name }: { name: string }) {
  const match = Object.keys(LOGO_MAP).find((k) => name.startsWith(k));
  const src = match ? LOGO_MAP[match] : null;

  if (src) {
    return (
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "10px",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        <img
          src={src}
          alt={name + " logo"}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }

  // Fallback: initials badge for partners without a logo file
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();

  return (
    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "10px",
        background: "rgba(206,86,5,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: initials.length > 2 ? "10px" : "13px",
          fontWeight: 900,
          color: "#CE5605",
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {initials}
      </span>
    </div>
  );
}

export default function Partners() {
  const t = useTranslations("partners");
  const items = t.raw("items") as Array<{
    category: string;
    list: Array<{ name: string; desc: string }>;
  }>;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="partners"
      ref={ref}
      style={{
        padding: "clamp(60px, 10vw, 120px) 0",
        background: "var(--bg-secondary)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 40px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "clamp(40px, 6vw, 64px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}
        >
          <div className="section-label" style={{ marginBottom: "20px" }}>
            {t("sectionLabel")}
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            {t("title")}{" "}
            <span className="text-gradient">{t("titleAccent")}</span>
          </h2>
          <p
            style={{
              maxWidth: "480px",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Partner groups */}
        <div
          className="partners-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(24px, 4vw, 48px)",
          }}
        >
          {items.map((group, gi) => (
            <div key={group.category}>
              <h3
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#CE5605",
                  marginBottom: "20px",
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.5s ease ${gi * 0.1}s`,
                }}
              >
                {group.category}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {group.list.map((item, ii) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      padding: "20px",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "none" : "translateY(16px)",
                      transition: `all 0.5s ease ${(gi * 3 + ii) * 0.08}s`,
                    }}
                  >
                    <PartnerLogo name={item.name} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "var(--text-primary)",
                          marginBottom: "5px",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.6,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .partners-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
