import { useState } from "react"

const SAMPLE_COBOLS = {
  "Tax Calculator": `IDENTIFICATION DIVISION.
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
    DISPLAY "Tax: " TAX-AMOUNT
    DISPLAY "Net: " NET-SALARY
    STOP RUN.`,
  "Bank Transfer": `IDENTIFICATION DIVISION.
PROGRAM-ID. BANK-TRANSFER.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 SENDER-ACCOUNT     PIC 9(10) VALUE 0.
01 TRANSFER-AMOUNT    PIC 9(7)V99 VALUE 0.
01 SENDER-BALANCE     PIC 9(7)V99 VALUE 5000.
01 STATUS-MESSAGE     PIC X(50).
PROCEDURE DIVISION.
    ACCEPT SENDER-ACCOUNT
    ACCEPT TRANSFER-AMOUNT
    IF TRANSFER-AMOUNT > SENDER-BALANCE
        MOVE "FAILED: Insufficient funds" TO STATUS-MESSAGE
    ELSE
        SUBTRACT TRANSFER-AMOUNT FROM SENDER-BALANCE
        MOVE "SUCCESS: Transfer completed" TO STATUS-MESSAGE
    END-IF
    DISPLAY STATUS-MESSAGE
    STOP RUN.`,
  "Loan Calculator": `IDENTIFICATION DIVISION.
PROGRAM-ID. LOAN-CALCULATOR.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 LOAN-AMOUNT        PIC 9(9)V99 VALUE 0.
01 INTEREST-RATE      PIC V999    VALUE 0.085.
01 LOAN-TERM-YEARS    PIC 9(2)    VALUE 0.
01 MONTHLY-PAYMENT    PIC 9(7)V99 VALUE 0.
PROCEDURE DIVISION.
    ACCEPT LOAN-AMOUNT
    ACCEPT LOAN-TERM-YEARS
    COMPUTE MONTHLY-PAYMENT = LOAN-AMOUNT * INTEREST-RATE
    DISPLAY "Monthly Payment: " MONTHLY-PAYMENT
    STOP RUN.`,
  "Inventory Check": `IDENTIFICATION DIVISION.
PROGRAM-ID. INVENTORY-CHECK.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 PRODUCT-CODE       PIC X(10) VALUE SPACES.
01 STOCK-COUNT        PIC 9(5) VALUE 0.
01 REORDER-LEVEL      PIC 9(5) VALUE 100.
01 STATUS-MSG         PIC X(50).
PROCEDURE DIVISION.
    ACCEPT PRODUCT-CODE
    ACCEPT STOCK-COUNT
    IF STOCK-COUNT < REORDER-LEVEL
        MOVE "ALERT: Reorder required" TO STATUS-MSG
    ELSE
        MOVE "OK: Stock sufficient" TO STATUS-MSG
    END-IF
    DISPLAY STATUS-MSG
    STOP RUN.`,
  "Payroll System": `IDENTIFICATION DIVISION.
PROGRAM-ID. PAYROLL-SYSTEM.
DATA DIVISION.
WORKING-STORAGE SECTION.
01 EMPLOYEE-ID        PIC 9(6) VALUE 0.
01 HOURS-WORKED       PIC 9(3)V99 VALUE 0.
01 HOURLY-RATE        PIC 9(4)V99 VALUE 0.
01 GROSS-PAY          PIC 9(7)V99 VALUE 0.
01 DEDUCTIONS         PIC 9(5)V99 VALUE 0.
01 NET-PAY            PIC 9(7)V99 VALUE 0.
PROCEDURE DIVISION.
    ACCEPT EMPLOYEE-ID
    ACCEPT HOURS-WORKED
    ACCEPT HOURLY-RATE
    COMPUTE GROSS-PAY = HOURS-WORKED * HOURLY-RATE
    COMPUTE DEDUCTIONS = GROSS-PAY * 0.25
    COMPUTE NET-PAY = GROSS-PAY - DEDUCTIONS
    DISPLAY "Gross Pay: " GROSS-PAY
    DISPLAY "Net Pay: " NET-PAY
    STOP RUN.`
}

export default function PlaygroundPage({ token, setActivePage }) {
  const [cobolCode, setCobolCode] = useState(SAMPLE_COBOLS["Tax Calculator"])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("output")
  const [selectedSample, setSelectedSample] = useState("Tax Calculator")
  const [fontSize, setFontSize] = useState(13)

  const handleTranslate = async () => {
    if (!cobolCode.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const blob = new Blob([cobolCode], { type: "text/plain" })
      const file = new File([blob], "playground.cbl", { type: "text/plain" })
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("https://legacybridge.onrender.com/translate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Translation failed")
      setResult(data)
      setActiveTab("output")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  }

  const lineCount = cobolCode.split("\n").length

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1400px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <p style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500", marginBottom: "4px" }}>Interactive Editor</p>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Playground</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0 }}>Write or paste COBOL code directly and translate it instantly</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "var(--text3)", fontSize: "0.78rem" }}>Font:</span>
          <button onClick={() => setFontSize(f => Math.max(10, f - 1))} style={{ padding: "4px 8px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--text2)" }}>A-</button>
          <button onClick={() => setFontSize(f => Math.min(18, f + 1))} style={{ padding: "4px 8px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--text2)" }}>A+</button>
          <button onClick={() => setActivePage("translate")} style={{ padding: "8px 14px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontSize: "0.82rem", fontWeight: "500" }}>Upload File Instead</button>
        </div>
      </div>

      {/* Sample Selector */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "14px 16px", marginBottom: "16px", boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text2)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sample Programs</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Object.keys(SAMPLE_COBOLS).map((name) => (
            <button key={name} onClick={() => { setSelectedSample(name); setCobolCode(SAMPLE_COBOLS[name]); setResult(null) }}
              style={{ padding: "6px 14px", background: selectedSample === name ? "var(--primary)" : "var(--bg2)", border: `1px solid ${selectedSample === name ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius)", fontSize: "0.78rem", fontWeight: "500", color: selectedSample === name ? "white" : "var(--text2)", transition: "all 0.15s" }}>
              {name}
            </button>
          ))}
          <button onClick={() => { setSelectedSample(null); setCobolCode(""); setResult(null) }}
            style={{ padding: "6px 14px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.78rem", fontWeight: "500", color: "var(--text2)" }}>
            + Blank
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Editor */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--text3)", fontFamily: "JetBrains Mono, monospace" }}>playground.cbl</span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{lineCount} lines</span>
              <button onClick={() => handleCopy(cobolCode)} style={{ padding: "4px 10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text2)", fontWeight: "500" }}>Copy</button>
              <button onClick={() => setCobolCode("")} style={{ padding: "4px 10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--red)", fontWeight: "500" }}>Clear</button>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ background: "var(--bg2)", borderRight: "1px solid var(--border)", padding: "14px 8px", textAlign: "right", userSelect: "none", minWidth: "36px" }}>
              {cobolCode.split("\n").map((_, i) => (
                <div key={i} style={{ fontSize: `${fontSize - 2}px`, color: "var(--text4)", lineHeight: "1.6", fontFamily: "JetBrains Mono, monospace" }}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={cobolCode}
              onChange={(e) => setCobolCode(e.target.value)}
              placeholder="Write or paste your COBOL code here..."
              style={{ flex: 1, padding: "14px", border: "none", outline: "none", resize: "none", fontSize: `${fontSize}px`, fontFamily: "JetBrains Mono, monospace", lineHeight: "1.6", color: "var(--text)", background: "white", minHeight: "500px" }}
            />
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>COBOL · {cobolCode.length} chars</span>
            <button onClick={handleTranslate} disabled={loading || !cobolCode.trim()}
              style={{ padding: "8px 20px", background: loading || !cobolCode.trim() ? "var(--bg3)" : "var(--primary)", border: "none", borderRadius: "var(--radius)", color: loading || !cobolCode.trim() ? "var(--text3)" : "white", fontSize: "0.82rem", fontWeight: "600", transition: "all 0.15s" }}>
              {loading ? "Translating..." : "▶ Run Translation"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
            {["output", "analysis", "tests"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "10px 16px", border: "none", borderBottom: `2px solid ${activeTab === tab ? "var(--primary)" : "transparent"}`, background: "transparent", color: activeTab === tab ? "var(--primary)" : "var(--text2)", fontSize: "0.82rem", fontWeight: activeTab === tab ? "600" : "400", marginBottom: "-1px", textTransform: "capitalize" }}>
                {tab === "output" ? "Generated Python" : tab === "analysis" ? "AI Analysis" : "Test Cases"}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {result && (
              <div style={{ padding: "6px 12px", display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--green)", fontWeight: "600" }}>✓ {result.confidence_score}% confidence</span>
                <button onClick={() => handleCopy(result.generated_code)} style={{ padding: "4px 10px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text2)", fontWeight: "500" }}>Copy</button>
              </div>
            )}
          </div>

          <div style={{ minHeight: "500px", padding: "14px" }}>
            {!result && !loading && !error && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "460px", color: "var(--text3)", textAlign: "center" }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>▶</p>
                <p style={{ fontWeight: "600", marginBottom: "4px", color: "var(--text2)" }}>Ready to translate</p>
                <p style={{ fontSize: "0.82rem" }}>Click "Run Translation" to see the generated Python API</p>
              </div>
            )}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "460px", color: "var(--text3)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "12px", animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</div>
                <p style={{ fontWeight: "600", color: "var(--text2)", marginBottom: "4px" }}>AI is translating...</p>
                <p style={{ fontSize: "0.82rem" }}>Analyzing COBOL structure and generating Python API</p>
              </div>
            )}

            {error && (
              <div style={{ background: "var(--red-light)", border: "1px solid #fecaca", borderRadius: "var(--radius)", padding: "14px", color: "var(--red)", fontSize: "0.85rem" }}>
                <p style={{ fontWeight: "600", margin: "0 0 4px" }}>⚠️ Translation Failed</p>
                <p style={{ margin: 0, opacity: 0.8 }}>{error}</p>
              </div>
            )}

            {result && activeTab === "output" && (
              <pre style={{ background: "var(--bg2)", padding: "14px", borderRadius: "var(--radius)", overflow: "auto", color: "#1e40af", fontSize: `${fontSize - 1}px`, lineHeight: "1.6", maxHeight: "480px", border: "1px solid var(--border)", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
                {result.generated_code}
              </pre>
            )}

            {result && activeTab === "analysis" && (
              <div>
                <div style={{ background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius)", padding: "14px", marginBottom: "12px" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--primary)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Understanding</p>
                  <p style={{ color: "var(--text2)", lineHeight: "1.7", fontSize: "0.85rem", margin: 0 }}>{result.understanding}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {[
                    { label: "Program", value: result.program_name },
                    { label: "Confidence", value: `${result.confidence_score}%` },
                    { label: "Output", value: "FastAPI endpoint" },
                    { label: "Model", value: "LLaMA 3.3 70B" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 12px" }}>
                      <p style={{ color: "var(--text3)", fontSize: "0.72rem", fontWeight: "500", margin: "0 0 2px" }}>{item.label}</p>
                      <p style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: "600", margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && activeTab === "tests" && (
              <pre style={{ background: "var(--bg2)", padding: "14px", borderRadius: "var(--radius)", overflow: "auto", color: "var(--green)", fontSize: `${fontSize - 1}px`, lineHeight: "1.6", maxHeight: "480px", border: "1px solid var(--border)", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
{`import pytest
from fastapi.testclient import TestClient
from ${result.program_name.toLowerCase().replace(/-/g,"_")}_api import app

client = TestClient(app)

def test_endpoint_exists():
    response = client.post("/")
    assert response.status_code in [200, 422]

def test_valid_input():
    # Add your test data here
    assert True

def test_invalid_input():
    response = client.post("/", json={"invalid": "data"})
    assert response.status_code == 422
`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}