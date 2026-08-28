"use client";
import { useState } from "react";
import { useTranslations } from "@/i18n";
import { Mail } from "lucide-react";

export default function WhatsApp() {
  const t = useTranslations("whatsapp");
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
      <div style={{
        background: "var(--card-bg, white)", color: "var(--text-primary, #161616)",
        padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
        whiteSpace: "nowrap", boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.08)",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateX(0) scale(1)" : "translateX(8px) scale(0.95)",
        transition: "all 0.25s ease", pointerEvents: "none", fontFamily: "'Lato', sans-serif",
        display: "flex", alignItems: "center", gap: "6px",
      }}>
        <Mail size={16} /> {t("tooltip")}
      </div>
      <a
        href="mailto:info@aerpalma.aero"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="whatsapp-btn"
        style={{ textDecoration: "none" }}
        aria-label="Email AeroPalma"
      >
        <Mail size={30} color="white" strokeWidth={2.5} style={{ position: "relative", zIndex: 1 }} />
      </a>
    </div>
  );
}
