"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n";

export default function Services() {
  const t = useTranslations("services");
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const items = t.raw("items") as Array<{
    id: string;
    title: string;
    description: string;
    features: string[];
  }>;

  const images = [
    "/images/bh7IcEA25gCdipF7h6Nf.jpg",
    "/images/airport_96088902.jpg",
    "/images/1hHIc4022i0J0Nbm8vsd.jpg",
  ];

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
      id="services"
      ref={ref}
      style={{ padding: "clamp(60px, 10vw, 120px) 0", background: "var(--bg)" }}
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
          className="services-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "64px",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: "20px" }}>
              {t("sectionLabel")}
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 60px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "var(--text-primary)",
              }}
            >
              {t("title")}
              <br />
              <span className="text-gradient">{t("titleAccent")}</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: "340px",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="services-tabs"
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            marginBottom: "48px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch" as any,
            scrollbarWidth: "none" as any,
          }}
        >
          {items.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              style={{
                background: "none",
                border: "none",
                padding: "16px clamp(12px, 2vw, 28px)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: active === i ? "#CE5605" : "var(--text-secondary)",
                borderBottom:
                  active === i ? "2px solid #CE5605" : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s.id} — {s.title.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>

        {/* Detail view */}
        <div
          className="services-detail"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
            marginBottom: "80px",
          }}
        >
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              aspectRatio: "4/3",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease",
              position: "relative",
            }}
          >
            <img
              src={images[active]}
              alt={items[active].title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.5s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                background: "#CE5605",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {items[active].id}
            </div>
          </div>
          <div>
            <h3
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              {items[active].title}
            </h3>
            <p
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "36px",
              }}
            >
              {items[active].description}
            </p>
            <div
              className="services-features"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "40px",
              }}
            >
              {items[active].features.map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#CE5605",
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>
            <a href="#contact" className="btn-orange">
              {t("cta")}
            </a>
          </div>
        </div>

        {/* Cards */}
        <div
          className="services-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {items.map((s, i) => (
            <div
              key={s.id}
              className="service-card"
              style={{
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}
              onClick={() => setActive(i)}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: "#CE5605",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                {s.id}
              </div>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "12px",
                }}
              >
                {s.title}
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                }}
              >
                {s.description.slice(0, 110)}…
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .services-tabs::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .services-detail {
            grid-template-columns: 1fr !important;
          }
          .services-cards {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .services-features {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
