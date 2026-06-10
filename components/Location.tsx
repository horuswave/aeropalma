"use client";
import { useTranslations } from "@/i18n";

export default function Location() {
  const t = useTranslations("location");

  const lat = -10.844372;
  const lng = 40.508022;

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=${t("langCode") || "pt"}&z=16`;

  return (
    <section
      id="location"
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "48px",
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
                fontSize: "clamp(28px, 4vw, 56px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {t("title")}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                maxWidth: "460px",
                marginTop: "12px",
              }}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* Map with Pin */}
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              aspectRatio: "16/9",
              position: "relative",
            }}
          >
            <iframe
              src={`https://maps.google.com/maps?q=${lat},${lng}&hl=${t("langCode") || "pt"}&z=16&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div>
            <div style={{ marginBottom: "32px" }}>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "16px",
                }}
              >
                {t("airportName")}
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
              >
                {t("description")}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                fontSize: "14px",
              }}
            >
              <div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  {t("coordinatesLabel")}
                </div>
                <div style={{ fontWeight: 600, fontFamily: "monospace" }}>
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  {t("locationLabel")}
                </div>
                <div>{t("locationValue")}</div>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
              style={{ marginTop: "32px", display: "inline-block" }}
            >
              {t("viewOnMaps")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
