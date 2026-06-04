import { useState } from "react"
import axios from "axios"

const API_URL = "https://legacybridge.onrender.com"

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError("Please fill all fields")
    if (!isLogin && !form.name) return setError("Please enter your name")
    setLoading(true)
    setError(null)
    try {
      const endpoint = isLogin ? "/login" : "/register"
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const res = await axios.post(`${API_URL}${endpoint}`, payload)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      onLogin(res.data.user)
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>

      {/* Left Panel */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", position: "relative", overflow: "hidden" }}>

        {/* Pattern */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "60px" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", backdropFilter: "blur(10px)" }}>⚡</div>
            <span style={{ color: "white", fontSize: "1.2rem", fontWeight: "700", letterSpacing: "-0.3px" }}>LegacyBridge</span>
          </div>

          <h1 style={{ color: "white", fontSize: "2.8rem", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-1.5px", marginBottom: "20px" }}>
            Modernize Legacy<br />Banking Systems<br />with AI
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: "1.7", marginBottom: "48px", maxWidth: "400px" }}>
            Upload COBOL files from 1959. Get production-ready Python APIs in seconds. Trusted by engineers worldwide.
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "380px" }}>
            {[
              { value: "$3 Trillion", label: "Daily COBOL transactions processed globally" },
              { value: "95%+", label: "Average translation confidence score" },
              { value: "< 30 sec", label: "Average time to translate a COBOL program" },
              { value: "500+", label: "COBOL programs successfully translated" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-lg)", padding: "16px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ color: "white", fontSize: "1.3rem", fontWeight: "700", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", lineHeight: "1.4" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: "500px", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <div style={{ width: "100%" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "8px" }}>
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p style={{ color: "var(--text3)", fontSize: "0.9rem" }}>
              {isLogin ? "Sign in to your LegacyBridge account" : "Start modernizing COBOL code for free"}
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display: "flex", background: "var(--bg2)", borderRadius: "var(--radius)", padding: "4px", marginBottom: "24px", border: "1px solid var(--border)" }}>
            {["Login", "Register"].map((tab) => (
              <button key={tab} onClick={() => { setIsLogin(tab === "Login"); setError(null) }}
                style={{ flex: 1, padding: "9px", border: "none", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", fontWeight: "500", transition: "all 0.15s",
                  background: (isLogin && tab === "Login") || (!isLogin && tab === "Register") ? "white" : "transparent",
                  color: (isLogin && tab === "Login") || (!isLogin && tab === "Register") ? "var(--text)" : "var(--text3)",
                  boxShadow: (isLogin && tab === "Login") || (!isLogin && tab === "Register") ? "var(--shadow)" : "none"
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Full Name</label>
                <input type="text" placeholder="Vinay Narwal" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.9rem", outline: "none", background: "var(--bg)", color: "var(--text)", transition: "border-color 0.15s" }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border2)"} />
              </div>
            )}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Email address</label>
              <input type="email" placeholder="vinay@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.9rem", outline: "none", background: "var(--bg)", color: "var(--text)" }}
                onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                onBlur={(e) => e.target.style.borderColor = "var(--border2)"} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.9rem", outline: "none", background: "var(--bg)", color: "var(--text)" }}
                onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                onBlur={(e) => e.target.style.borderColor = "var(--border2)"} />
            </div>
          </div>

          {error && (
            <div style={{ background: "var(--red-light)", border: "1px solid #fecaca", borderRadius: "var(--radius)", padding: "10px 12px", marginTop: "16px", color: "var(--red)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "11px", background: loading ? "var(--bg3)" : "var(--primary)", border: "none", borderRadius: "var(--radius)", color: loading ? "var(--text3)" : "white", fontSize: "0.9rem", fontWeight: "600", marginTop: "20px", transition: "all 0.15s", boxShadow: loading ? "none" : "0 1px 2px rgba(37,99,235,0.3)" }}>
            {loading ? "Please wait..." : isLogin ? "Sign in →" : "Create account →"}
          </button>

          {!isLogin && (
            <p style={{ textAlign: "center", color: "var(--text4)", fontSize: "0.78rem", marginTop: "16px", lineHeight: "1.5" }}>
              By creating an account, you agree to our Terms of Service.<br />Free plan includes 10 translations/month.
            </p>
          )}

          {/* Features */}
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
            <p style={{ color: "var(--text3)", fontSize: "0.78rem", fontWeight: "500", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>What you get</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "AI-powered COBOL to Python API translation",
                "JWT-secured personal dashboard",
                "Translation history with search & export",
                "Download generated FastAPI code instantly",
                "10 free translations per month",
              ].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text2)" }}>
                  <span style={{ color: "var(--green)", fontSize: "0.9rem" }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}