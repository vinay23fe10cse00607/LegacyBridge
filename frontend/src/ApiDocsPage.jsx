import { useState } from "react"

const API_BASE = "https://legacybridge.onrender.com"

export default function ApiDocsPage({ token }) {
  const [activeEndpoint, setActiveEndpoint] = useState("translate")
  const [copied, setCopied] = useState(null)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const endpoints = [
    {
      id: "health",
      method: "GET",
      path: "/",
      title: "Health Check",
      description: "Check if the API is running and get version info",
      auth: false,
      response: `{
  "status": "running",
  "message": "LegacyBridge API v2.0 is live!",
  "version": "2.0.0"
}`,
      curl: `curl -X GET "${API_BASE}/"`,
    },
    {
      id: "register",
      method: "POST",
      path: "/register",
      title: "Register",
      description: "Create a new user account and get a JWT token",
      auth: false,
      body: `{
  "name": "Vinay Narwal",
  "email": "vinay@example.com",
  "password": "yourpassword"
}`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Vinay Narwal",
    "email": "vinay@example.com"
  }
}`,
      curl: `curl -X POST "${API_BASE}/register" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Vinay","email":"vinay@example.com","password":"pass"}'`,
    },
    {
      id: "login",
      method: "POST",
      path: "/login",
      title: "Login",
      description: "Authenticate and receive a JWT token",
      auth: false,
      body: `{
  "email": "vinay@example.com",
  "password": "yourpassword"
}`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Vinay Narwal",
    "email": "vinay@example.com"
  }
}`,
      curl: `curl -X POST "${API_BASE}/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"vinay@example.com","password":"pass"}'`,
    },
    {
      id: "me",
      method: "GET",
      path: "/me",
      title: "Get Current User",
      description: "Get details of the authenticated user",
      auth: true,
      response: `{
  "id": 1,
  "name": "Vinay Narwal",
  "email": "vinay@example.com",
  "created_at": "2026-01-01T00:00:00"
}`,
      curl: `curl -X GET "${API_BASE}/me" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      id: "translate",
      method: "POST",
      path: "/translate",
      title: "Translate COBOL",
      description: "Upload a COBOL file and get a translated Python FastAPI endpoint",
      auth: true,
      body: "multipart/form-data · file: your .cbl file",
      response: `{
  "success": true,
  "id": 1,
  "program_name": "TAX-CALCULATOR",
  "understanding": "This program calculates tax...",
  "generated_code": "from fastapi import FastAPI...",
  "confidence_score": 87,
  "created_at": "2026-01-01T00:00:00"
}`,
      curl: `curl -X POST "${API_BASE}/translate" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "file=@your_program.cbl"`,
    },
    {
      id: "history",
      method: "GET",
      path: "/history",
      title: "Get History",
      description: "Get all translations for the authenticated user",
      auth: true,
      response: `{
  "total": 3,
  "translations": [
    {
      "id": 1,
      "filename": "tax_calculator.cbl",
      "program_name": "TAX-CALCULATOR",
      "confidence_score": 87,
      "generated_code": "...",
      "created_at": "2026-01-01T00:00:00"
    }
  ]
}`,
      curl: `curl -X GET "${API_BASE}/history" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      id: "delete",
      method: "DELETE",
      path: "/history/{id}",
      title: "Delete Translation",
      description: "Delete a specific translation by ID",
      auth: true,
      response: `{
  "success": true,
  "message": "Translation deleted"
}`,
      curl: `curl -X DELETE "${API_BASE}/history/1" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    },
    {
      id: "stats",
      method: "GET",
      path: "/stats",
      title: "Get Stats",
      description: "Get translation statistics for the current user",
      auth: true,
      response: `{
  "total_translations": 5,
  "avg_confidence": 84.2,
  "highest_confidence": 95,
  "programs": ["TAX-CALCULATOR", "BANK-TRANSFER"]
}`,
      curl: `curl -X GET "${API_BASE}/stats" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    },
  ]

  const methodColor = (m) => m === "GET" ? "var(--green)" : m === "POST" ? "var(--primary)" : m === "DELETE" ? "var(--red)" : "var(--yellow)"
  const methodBg = (m) => m === "GET" ? "var(--green-light)" : m === "POST" ? "var(--primary-light)" : m === "DELETE" ? "var(--red-light)" : "var(--yellow-light)"

  const active = endpoints.find(e => e.id === activeEndpoint)

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1400px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500", marginBottom: "4px" }}>Developer Reference</p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", margin: "0 0 6px" }}>API Documentation</h1>
        <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0 }}>
          Base URL: <code style={{ background: "var(--bg2)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.82rem", color: "var(--primary)", fontFamily: "JetBrains Mono, monospace" }}>{API_BASE}</code>
        </p>
      </div>

      {/* Auth Info */}
      <div style={{ background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius-lg)", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "1.2rem" }}>🔒</span>
        <div>
          <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 2px", color: "var(--primary)" }}>Authentication Required</p>
          <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: 0 }}>
            Most endpoints require a Bearer token. Add <code style={{ background: "white", padding: "1px 6px", borderRadius: "4px", fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem" }}>Authorization: Bearer YOUR_TOKEN</code> header to authenticated requests.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "20px" }}>

        {/* Sidebar */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "12px", height: "fit-content", boxShadow: "var(--shadow-sm)", position: "sticky", top: "72px" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--text3)", margin: "0 0 8px", padding: "0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Endpoints</p>
          {endpoints.map((ep) => (
            <button key={ep.id} onClick={() => setActiveEndpoint(ep.id)}
              style={{ width: "100%", padding: "8px 10px", border: "none", borderRadius: "var(--radius)", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", transition: "all 0.15s",
                background: activeEndpoint === ep.id ? "var(--primary-light)" : "transparent",
                color: activeEndpoint === ep.id ? "var(--primary)" : "var(--text2)"
              }}>
              <span style={{ background: methodBg(ep.method), color: methodColor(ep.method), fontSize: "0.62rem", fontWeight: "700", padding: "2px 5px", borderRadius: "4px", fontFamily: "JetBrains Mono, monospace", minWidth: "42px", textAlign: "center" }}>
                {ep.method}
              </span>
              <span style={{ fontSize: "0.78rem", fontWeight: activeEndpoint === ep.id ? "600" : "400" }}>{ep.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {active && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeIn 0.2s ease" }}>

            {/* Endpoint Header */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ background: methodBg(active.method), color: methodColor(active.method), fontSize: "0.75rem", fontWeight: "700", padding: "4px 10px", borderRadius: "var(--radius-sm)", fontFamily: "JetBrains Mono, monospace" }}>
                  {active.method}
                </span>
                <code style={{ fontSize: "1rem", fontWeight: "600", color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}>{active.path}</code>
                {active.auth && (
                  <span style={{ background: "var(--yellow-light)", color: "var(--yellow)", fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>🔒 Auth Required</span>
                )}
              </div>
              <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0, lineHeight: "1.6" }}>{active.description}</p>
            </div>

            {/* Request Body */}
            {active.body && (
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" }}>
                  <p style={{ fontWeight: "600", fontSize: "0.82rem", margin: 0 }}>Request Body</p>
                  <button onClick={() => handleCopy(active.body, "body")} style={{ padding: "4px 10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text2)", fontWeight: "500" }}>
                    {copied === "body" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <pre style={{ padding: "16px", margin: 0, fontSize: "0.82rem", color: "#1e40af", lineHeight: "1.6", fontFamily: "JetBrains Mono, monospace", background: "var(--bg2)", overflow: "auto" }}>
                  {active.body}
                </pre>
              </div>
            )}

            {/* Response */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p style={{ fontWeight: "600", fontSize: "0.82rem", margin: 0 }}>Response</p>
                  <span style={{ background: "var(--green-light)", color: "var(--green)", fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>200 OK</span>
                </div>
                <button onClick={() => handleCopy(active.response, "response")} style={{ padding: "4px 10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text2)", fontWeight: "500" }}>
                  {copied === "response" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre style={{ padding: "16px", margin: 0, fontSize: "0.82rem", color: "var(--green)", lineHeight: "1.6", fontFamily: "JetBrains Mono, monospace", background: "#f0fdf4", overflow: "auto" }}>
                {active.response}
              </pre>
            </div>

            {/* cURL */}
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" }}>
                <p style={{ fontWeight: "600", fontSize: "0.82rem", margin: 0 }}>cURL Example</p>
                <button onClick={() => handleCopy(active.curl, "curl")} style={{ padding: "4px 10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text2)", fontWeight: "500" }}>
                  {copied === "curl" ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre style={{ padding: "16px", margin: 0, fontSize: "0.82rem", color: "var(--text2)", lineHeight: "1.6", fontFamily: "JetBrains Mono, monospace", background: "#1e1e2e", overflow: "auto" }}>
                <span style={{ color: "#00ff88" }}>{active.curl}</span>
              </pre>
            </div>

            {/* Your Token */}
            {token && (
              <div style={{ background: "var(--yellow-light)", border: "1px solid #fde68a", borderRadius: "var(--radius-lg)", padding: "14px 18px" }}>
                <p style={{ fontWeight: "600", fontSize: "0.82rem", margin: "0 0 6px", color: "var(--yellow)" }}>🔑 Your API Token</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <code style={{ flex: 1, background: "white", padding: "8px 12px", borderRadius: "var(--radius)", fontSize: "0.72rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: "1px solid #fde68a" }}>
                    {token}
                  </code>
                  <button onClick={() => handleCopy(token, "token")} style={{ padding: "8px 12px", background: "white", border: "1px solid #fde68a", borderRadius: "var(--radius)", fontSize: "0.78rem", color: "var(--yellow)", fontWeight: "500", flexShrink: 0 }}>
                    {copied === "token" ? "✓ Copied" : "Copy Token"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}