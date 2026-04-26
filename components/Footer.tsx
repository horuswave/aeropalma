"use client";
import { useTranslations } from "@/i18n";

export default function Footer() {
  const t = useTranslations("footer");
  const serviceLinks = t.raw("serviceLinks") as string[];
  const companyLinks = t.raw("companyLinks") as string[];

  return (
    <footer style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 0 32px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "60px", marginBottom: "60px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <polygon points="0,36 18,0 36,36 28,28 18,8 8,28" fill="#CE5605" />
                <polygon points="8,28 18,8 28,28 22,22 18,12 14,22" fill="#EA7628" opacity="0.6" />
              </svg>
              <span style={{ fontSize: "18px", fontWeight: 900, color: "white" }}>
                <span style={{ color: "#CE5605" }}>AERO</span>PALMA
              </span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: "240px", marginBottom: "24px" }}>
              {t("tagline")}
            </p>
            <a href="https://wa.me/258851013008" target="_blank" style={{ fontSize: "13px", fontWeight: 700, color: "#25D366", textDecoration: "none" }}>
              +258 851 013 008
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>{t("services")}</h4>
            {serviceLinks.map((s) => (
              <a key={s} href="#services" style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CE5605")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >{s}</a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>{t("company")}</h4>
            {companyLinks.map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CE5605")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >{s}</a>
            ))}
          </div>

          {/* Clients */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>{t("clients")}</h4>
            {["TotalEnergies", "ExxonMobil"].map((c) => (
              <div key={c} style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: "12px" }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} AeroPalma. {t("copyright")}
          </span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>aeropalma.aero</span>
        </div>
      </div>
    </footer>
  );
}
