"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock, FaArrowRight } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("aeropalma_token", data.token);
      router.push("/owner");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

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
          width: "100%",
          maxWidth: "360px",
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "40px 32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <img
              src="/logo.svg"
              alt="AeroPalma"
              style={{ height: "64px", width: "auto" }}
            />
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: ".08em",
              background: "#CE5605",
              color: "#fff",
              padding: "2px 8px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FaLock size={10} /> OWNER PORTAL
          </span>
        </div>

        <label
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "6px",
            border: `1px solid ${error ? "#e53e3e" : "var(--border)"}`,
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        />

        <label
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Enter your password"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "6px",
            border: `1px solid ${error ? "#e53e3e" : "var(--border)"}`,
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            fontSize: "14px",
            marginBottom: "6px",
          }}
        />

        {error && (
          <p
            style={{ fontSize: "12px", color: "#e53e3e", marginBottom: "10px" }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "11px",
            background: loading ? "#ccc" : "#CE5605",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
          {!loading && <FaArrowRight size={12} />}
        </button>
      </div>
    </main>
  );
}
