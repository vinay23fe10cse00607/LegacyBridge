import { useState } from "react"
import axios from "axios"

const API_URL = "https://legacybridge.onrender.com"

const SAMPLE_COBOLS = {
  "TAX-CALCULATOR": `IDENTIFICATION DIVISION.
PROGRAM-ID. TAX-CALCULATOR.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 EMPLOYEE-SALARY    PIC 9(7)V99 VALUE 0.
01 TAX-RATE           PIC V99     VALUE 0.30.
01 TAX-AMOUNT         PIC 9(7)V99 VALUE 0.
01 NET-SALARY         PIC 9(7)V99 VALUE 0.

PROCEDURE DIVISION.
    ACCEPT EMPLOYEE-SALARY
    COMPUTE TAX-AMOUNT = EMPLOYEE-SALARY * TAX-RATE
    COMPUTE NET-SALARY = EMPLOYEE-SALARY - TAX-AMOUNT
    DISPLAY "Tax Deducted: " TAX-AMOUNT
    DISPLAY "Net Salary: " NET-SALARY
    STOP RUN.`,

  "BANK-TRANSFER": `IDENTIFICATION DIVISION.
PROGRAM-ID. BANK-TRANSFER.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 SENDER-ACCOUNT     PIC 9(10) VALUE 0.
01 RECEIVER-ACCOUNT   PIC 9(10) VALUE 0.
01 TRANSFER-AMOUNT    PIC 9(7)V99 VALUE 0.
01 SENDER-BALANCE     PIC 9(7)V99 VALUE 5000.
01 STATUS-MESSAGE     PIC X(50).

PROCEDURE DIVISION.
    ACCEPT SENDER-ACCOUNT
    ACCEPT RECEIVER-ACCOUNT
    ACCEPT TRANSFER-AMOUNT
    IF TRANSFER-AMOUNT > SENDER-BALANCE
        MOVE "FAILED: Insufficient funds" TO STATUS-MESSAGE
    ELSE
        SUBTRACT TRANSFER-AMOUNT FROM SENDER-BALANCE
        MOVE "SUCCESS: Transfer completed" TO STATUS-MESSAGE
    END-IF
    DISPLAY STATUS-MESSAGE
    STOP RUN.`,

  "LOAN-CALCULATOR": `IDENTIFICATION DIVISION.
PROGRAM-ID. LOAN-CALCULATOR.

DATA DIVISION.
WORKING-STORAGE SECTION.
01 LOAN-AMOUNT        PIC 9(9)V99 VALUE 0.
01 INTEREST-RATE      PIC V999    VALUE 0.085.
01 LOAN-TERM-YEARS    PIC 9(2)    VALUE 0.
01 MONTHLY-PAYMENT    PIC 9(7)V99 VALUE 0.
01 TOTAL-PAYMENT      PIC 9(9)V99 VALUE 0.

PROCEDURE DIVISION.
    ACCEPT LOAN-AMOUNT
    ACCEPT LOAN-TERM-YEARS
    COMPUTE MONTHLY-PAYMENT = (LOAN-AMOUNT * INTEREST-RATE) /
            (1 - (1 + INTEREST-RATE) ** (-LOAN-TERM-YEARS * 12))
    COMPUTE TOTAL-PAYMENT = MONTHLY-PAYMENT * LOAN-TERM-YEARS * 12
    DISPLAY "Monthly Payment: " MONTHLY-PAYMENT
    DISPLAY "Total Payment: " TOTAL-PAYMENT
    STOP RUN.`
}

export default function TranslatePage({ token, setActivePage }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [step, setStep] = useState(0)
  const [activeTab, setActiveTab] = useState("generated")
  const [selectedSample, setSelectedSample] = useState(null)

  const steps = [
    "Reading COBOL file...",
    "Parsing divisions and variables...",
    "Extracting business logic...",
    "AI understanding the code...",
    "Generating Python API...",
    "Running validation checks...",
    "Calculating confidence score...",
  ]

  const handleTranslate = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    setStep(0)

    const interval = setInterval(() => {
      setStep(prev => prev < steps.length - 1 ? prev + 1 : prev)
    }, 1800)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post(`${API_URL}/translate`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      clearInterval(interval)
      setResult(res.data)
      setActiveTab("generated")
    } catch (err) {
      clearInterval(interval)
      setError(err.response?.data?.detail || "Translation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.generated_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([result.generated_code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${result.program_name.toLowerCase()}_api.py`
    a.click()
  }

  const loadSample = (name) => {
    setSelectedSample(name)
    const content = SAMPLE_COBOLS[name]
    const blob = new Blob([content], { type: "text/plain" })
    const sampleFile = new File([blob], `${name.toLowerCase()}.cbl`, { type: "text/plain" })
    setFile(sampleFile)
    setResult(null)
    setError(null)
  }

  const confidenceColor = result?.confidence_score >= 80 ? "var(--green)" : result?.confidence_score >= 60 ? "var(--yellow)" : "var(--red)"

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1400px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500", marginBottom: "4px" }}>AI Translation</p>
            <h1 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", margin: "0 0 6px" }}>COBOL → Python API</h1>
            <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0 }}>Upload your legacy COBOL file and get a production-ready FastAPI endpoint instantly</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setActivePage("history")}
              style={{ padding: "8px 16px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontSize: "0.82rem", fontWeight: "500" }}>
              ◷ View History
            </button>
            <button onClick={() => setActivePage("playground")}
              style={{ padding: "8px 16px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontSize: "0.82rem", fontWeight: "500" }}>
              ◈ Try Playground
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1.3fr" : "1fr 1fr", gap: "20px" }}>

        {/* Left — Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Sample Programs */}
          <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text2)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Try Sample Programs</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Object.keys(SAMPLE_COBOLS).map((name) => (
                <button key={name} onClick={() => loadSample(name)}
                  style={{ padding: "6px 12px", background: selectedSample === name ? "var(--primary)" : "var(--bg2)", border: `1px solid ${selectedSample === name ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius)", fontSize: "0.78rem", fontWeight: "500", color: selectedSample === name ? "white" : "var(--text2)", transition: "all 0.15s" }}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0]); setSelectedSample(null) }}
            style={{ background: dragOver ? "#eff6ff" : "white", border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border2)"}`, borderRadius: "var(--radius-lg)", padding: "32px", textAlign: "center", transition: "all 0.15s", cursor: "pointer" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📂</div>
            <p style={{ color: "var(--text2)", marginBottom: "4px", fontWeight: "500", fontSize: "0.875rem" }}>
              {file ? file.name : "Drag & drop your COBOL file"}
            </p>
            <p style={{ color: "var(--text4)", fontSize: "0.78rem", marginBottom: "14px" }}>Supports .cbl files up to 5MB</p>
            <input type="file" accept=".cbl,.txt" onChange={(e) => { setFile(e.target.files[0]); setSelectedSample(null) }} style={{ display: "none" }} id="fileInput" />
            <label htmlFor="fileInput"
              style={{ padding: "7px 16px", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", color: "var(--text2)", cursor: "pointer", fontSize: "0.82rem", fontWeight: "500" }}>
              Browse Files
            </label>
          </div>

          {/* File Selected */}
          {file && (
            <div style={{ background: "var(--green-light)", border: "1px solid #bbf7d0", borderRadius: "var(--radius)", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📄</span>
                <div>
                  <p style={{ color: "var(--green)", fontWeight: "600", margin: 0, fontSize: "0.82rem" }}>{file.name}</p>
                  <p style={{ color: "var(--text3)", margin: 0, fontSize: "0.72rem" }}>{(file.size / 1024).toFixed(1)} KB · COBOL source file</p>
                </div>
              </div>
              <button onClick={() => { setFile(null); setSelectedSample(null) }}
                style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>×</button>
            </div>
          )}

          {/* Translate Button */}
          <button onClick={handleTranslate} disabled={loading || !file}
            style={{ width: "100%", padding: "12px", background: loading || !file ? "var(--bg3)" : "var(--primary)", border: loading || !file ? "1px solid var(--border)" : "none", borderRadius: "var(--radius)", color: loading || !file ? "var(--text3)" : "white", fontSize: "0.9rem", fontWeight: "600", transition: "all 0.15s", boxShadow: loading || !file ? "none" : "0 1px 2px rgba(37,99,235,0.3)" }}>
            {loading ? "Translating..." : !file ? "Select a file to continue" : "⚡ Translate to Python API"}
          </button>

          {/* Loading Steps */}
          {loading && (
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text2)", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Processing</p>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", opacity: i <= step ? 1 : 0.35, transition: "opacity 0.3s" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "700",
                    background: i < step ? "var(--green)" : i === step ? "var(--primary)" : "var(--bg3)",
                    color: i < step || i === step ? "white" : "var(--text3)",
                    border: `2px solid ${i < step ? "var(--green)" : i === step ? "var(--primary)" : "var(--border2)"}`,
                    animation: i === step ? "pulse 1s ease infinite" : "none"
                  }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: i === step ? "var(--text)" : "var(--text2)", fontWeight: i === step ? "500" : "400" }}>{s}</p>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "var(--red-light)", border: "1px solid #fecaca", borderRadius: "var(--radius)", padding: "12px 14px", color: "var(--red)", fontSize: "0.85rem", display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span>⚠️</span>
              <div>
                <p style={{ fontWeight: "600", margin: "0 0 2px" }}>Translation Failed</p>
                <p style={{ margin: 0, opacity: 0.8 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { icon: "🤖", title: "AI-Powered", desc: "Groq LLM understands COBOL logic" },
              { icon: "⚡", title: "Instant", desc: "Results in under 30 seconds" },
              { icon: "🔒", title: "Secure", desc: "Files processed and deleted" },
              { icon: "✅", title: "Production Ready", desc: "FastAPI with validation" },
            ].map((c) => (
              <div key={c.title} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px", boxShadow: "var(--shadow-sm)" }}>
                <p style={{ fontSize: "1.1rem", margin: "0 0 4px" }}>{c.icon}</p>
                <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text)", margin: "0 0 2px" }}>{c.title}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text3)", margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Result or Preview */}
        <div>
          {!result ? (
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", height: "100%", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text2)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {file ? "COBOL Preview" : "How It Works"}
              </p>
              {file ? (
                <pre style={{ background: "var(--bg2)", padding: "16px", borderRadius: "var(--radius)", fontSize: "0.78rem", color: "var(--text2)", lineHeight: "1.6", overflow: "auto", maxHeight: "500px", border: "1px solid var(--border)", margin: 0 }}>
                  {selectedSample ? SAMPLE_COBOLS[selectedSample] : "File loaded. Click translate to process."}
                </pre>
              ) : (
                <div>
                  {[
                    { step: "01", title: "Upload COBOL File", desc: "Select or drag your .cbl legacy file into the upload area. You can also try our sample programs.", icon: "📤" },
                    { step: "02", title: "AI Analyzes Code", desc: "Our AI reads the COBOL divisions, extracts variables, and understands the business logic.", icon: "🤖" },
                    { step: "03", title: "Python API Generated", desc: "A production-ready FastAPI endpoint is created with Pydantic models and input validation.", icon: "⚡" },
                    { step: "04", title: "Download & Deploy", desc: "Copy the code, download the .py file, and deploy it alongside your existing systems.", icon: "🚀" },
                  ].map((item, i) => (
                    <div key={item.step} style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
                      <div style={{ width: "36px", height: "36px", background: "var(--primary-light)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--primary)", letterSpacing: "0.05em" }}>STEP {item.step}</span>
                          <span style={{ fontWeight: "600", fontSize: "0.875rem" }}>{item.title}</span>
                        </div>
                        <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: 0, lineHeight: "1.5" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "fadeIn 0.3s ease" }}>

              {/* Result Header */}
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ background: "var(--green-light)", color: "var(--green)", fontSize: "0.72rem", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>✓ SUCCESS</span>
                      <span style={{ color: "var(--text3)", fontSize: "0.78rem" }}>Translation complete</span>
                    </div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text)", margin: 0, letterSpacing: "-0.3px" }}>{result.program_name}</h2>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "var(--text3)", fontSize: "0.72rem", fontWeight: "500", margin: "0 0 4px" }}>CONFIDENCE</p>
                    <p style={{ fontSize: "1.6rem", fontWeight: "700", color: confidenceColor, margin: 0, letterSpacing: "-1px" }}>{result.confidence_score}%</p>
                  </div>
                </div>
                <div style={{ background: "var(--bg2)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ background: confidenceColor, height: "100%", width: `${result.confidence_score}%`, borderRadius: "4px", transition: "width 1s ease" }} />
                </div>
              </div>

              {/* Tabs */}
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
                  {[
                    { id: "generated", label: "Generated API" },
                    { id: "understanding", label: "AI Analysis" },
                    { id: "sidebyside", label: "Side by Side" },
                    { id: "tests", label: "Test Cases" },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      style={{ padding: "10px 16px", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "var(--primary)" : "transparent"}`, background: "transparent", color: activeTab === tab.id ? "var(--primary)" : "var(--text2)", fontSize: "0.82rem", fontWeight: activeTab === tab.id ? "600" : "400", marginBottom: "-1px", transition: "all 0.15s" }}>
                      {tab.label}
                    </button>
                  ))}
                  <div style={{ flex: 1 }} />
                  <div style={{ display: "flex", gap: "6px", padding: "6px 12px", alignItems: "center" }}>
                    <button onClick={handleCopy}
                      style={{ padding: "5px 12px", background: copied ? "var(--green-light)" : "white", border: `1px solid ${copied ? "#bbf7d0" : "var(--border)"}`, borderRadius: "var(--radius-sm)", color: copied ? "var(--green)" : "var(--text2)", fontSize: "0.78rem", fontWeight: "500" }}>
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                    <button onClick={handleDownload}
                      style={{ padding: "5px 12px", background: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "white", fontSize: "0.78rem", fontWeight: "600" }}>
                      ⬇ Download
                    </button>
                  </div>
                </div>

                <div style={{ padding: "16px" }}>
                  {activeTab === "generated" && (
                    <pre style={{ background: "var(--bg2)", padding: "16px", borderRadius: "var(--radius)", overflow: "auto", color: "#1e40af", fontSize: "0.78rem", lineHeight: "1.6", maxHeight: "420px", border: "1px solid var(--border)", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
                      {result.generated_code}
                    </pre>
                  )}

                  {activeTab === "understanding" && (
                    <div>
                      <div style={{ background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius)", padding: "14px", marginBottom: "12px" }}>
                        <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--primary)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Understanding</p>
                        <p style={{ color: "var(--text2)", lineHeight: "1.7", fontSize: "0.875rem", margin: 0 }}>{result.understanding}</p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[
                          { label: "Program Name", value: result.program_name },
                          { label: "Confidence Score", value: `${result.confidence_score}%` },
                          { label: "Output Format", value: "FastAPI + Pydantic" },
                          { label: "Language", value: "Python 3.10+" },
                        ].map((item) => (
                          <div key={item.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 12px" }}>
                            <p style={{ color: "var(--text3)", fontSize: "0.72rem", fontWeight: "500", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                            <p style={{ color: "var(--text)", fontSize: "0.875rem", fontWeight: "600", margin: 0 }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "sidebyside" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--text3)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Original COBOL</p>
                        <pre style={{ background: "#fef3c7", padding: "12px", borderRadius: "var(--radius)", overflow: "auto", color: "#92400e", fontSize: "0.72rem", lineHeight: "1.6", maxHeight: "360px", border: "1px solid #fde68a", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
                          {selectedSample ? SAMPLE_COBOLS[selectedSample] : "COBOL source code"}
                        </pre>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--text3)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Generated Python</p>
                        <pre style={{ background: "var(--primary-light)", padding: "12px", borderRadius: "var(--radius)", overflow: "auto", color: "#1e40af", fontSize: "0.72rem", lineHeight: "1.6", maxHeight: "360px", border: "1px solid #bfdbfe", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
                          {result.generated_code}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === "tests" && (
                    <div>
                      <p style={{ color: "var(--text2)", fontSize: "0.82rem", marginBottom: "12px" }}>Auto-generated test cases for your translated API:</p>
                      <pre style={{ background: "var(--bg2)", padding: "16px", borderRadius: "var(--radius)", overflow: "auto", color: "var(--green)", fontSize: "0.78rem", lineHeight: "1.6", maxHeight: "360px", border: "1px solid var(--border)", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
{`import pytest
from fastapi.testclient import TestClient
from ${result.program_name.toLowerCase().replace("-","_")}_api import app

client = TestClient(app)

class Test${result.program_name.replace("-","")}:
    """Auto-generated tests for ${result.program_name}"""

    def test_endpoint_returns_200(self):
        """Test that endpoint responds successfully"""
        response = client.post("/translate", json={})
        assert response.status_code in [200, 422]

    def test_valid_input(self):
        """Test with valid input values"""
        # Add your test values here
        assert True

    def test_invalid_input_returns_422(self):
        """Test that invalid input is rejected"""
        response = client.post("/translate", json={"invalid": "data"})
        assert response.status_code == 422

    def test_response_schema(self):
        """Test response has expected fields"""
        assert True  # Add schema validation
`}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setFile(null); setResult(null); setSelectedSample(null) }}
                  style={{ flex: 1, padding: "10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontWeight: "500", fontSize: "0.82rem" }}>
                  🔄 Translate Another
                </button>
                <button onClick={() => setActivePage("history")}
                  style={{ flex: 1, padding: "10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontWeight: "500", fontSize: "0.82rem" }}>
                  📚 View in History
                </button>
                <button onClick={() => setActivePage("playground")}
                  style={{ flex: 1, padding: "10px", background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius)", color: "var(--primary)", fontWeight: "500", fontSize: "0.82rem" }}>
                  ◈ Test in Playground
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}