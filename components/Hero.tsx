"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n";

export default function Hero() {
  const t = useTranslations("hero");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=85&auto=format&fit=crop)`,
        backgroundSize: "cover", backgroundPosition: "center 40%",
        transform: loaded ? "scale(1)" : "scale(1.05)",
        transition: "transform 8s ease",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.2) 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "4px", background: "linear-gradient(to bottom, transparent, #CE5605, #EA7628, transparent)" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1280px", margin: "0 auto", padding: "120px 40px 80px", width: "100%" }}>
        <div style={{ maxWidth: "720px" }}>
          <div className="section-label animate-fade-up" style={{ color: "#EA7628", marginBottom: "24px" }}>
            {t("label")}
          </div>

          <h1 className="animate-fade-up-d1" style={{ fontSize: "clamp(44px, 6vw, 88px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", color: "#FFFFFF", marginBottom: "28px" }}>
            {t("title1")}{" "}
            <span style={{ background: "linear-gradient(135deg, #CE5605, #EA7628)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {t("titleAccent")}
            </span>
            <br />{t("title2")}
          </h1>

          <p className="animate-fade-up-d2" style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.72)", maxWidth: "540px", marginBottom: "44px" }}>
            {t("description")}
          </p>

          <div className="animate-fade-up-d3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#services" className="btn-orange">{t("ctaPrimary")}</a>
            <a href="#contact" className="btn-outline" style={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.25)" }}>
              {t("ctaSecondary")}
            </a>
          </div>

          <div className="animate-fade-up-d3" style={{ display: "flex", gap: "48px", marginTop: "72px", flexWrap: "wrap" }}>
            {[
              { value: t("stat1Value"), label: t("stat1Label") },
              { value: t("stat2Value"), label: t("stat2Label") },
              { value: t("stat3Value"), label: t("stat3Label") },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#CE5605", letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-float" style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Scroll</div>
        <div style={{ width: "24px", height: "38px", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: "12px", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "6px" }}>
          <div style={{ width: "4px", height: "8px", background: "#CE5605", borderRadius: "2px", animation: "scrollDot 2s ease-in-out infinite" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(12px); opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
