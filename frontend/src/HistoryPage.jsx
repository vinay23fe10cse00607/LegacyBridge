import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "https://legacybridge.onrender.com"

export default function HistoryPage({ token, setActivePage }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [activeTab, setActiveTab] = useState("code")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(res.data.translations)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await axios.delete(`${API_URL}/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(history.filter(t => t.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (err) {
      console.log(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleDownload = (item) => {
    const blob = new Blob([item.generated_code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.program_name.toLowerCase().replace("-","_")}_api.py`
    a.click()
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportAll = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "legacybridge_history.json"
    a.click()
  }

  const confidenceColor = (s) => s >= 80 ? "var(--green)" : s >= 60 ? "var(--yellow)" : "var(--red)"
  const confidenceBg = (s) => s >= 80 ? "var(--green-light)" : s >= 60 ? "var(--yellow-light)" : "var(--red-light)"

  const filtered = history
    .filter(t => {
      const matchSearch = t.program_name.toLowerCase().includes(search.toLowerCase()) || t.filename.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === "all" || (filter === "high" && t.confidence_score >= 80) || (filter === "medium" && t.confidence_score >= 60 && t.confidence_score < 80) || (filter === "low" && t.confidence_score < 60)
      return matchSearch && matchFilter
    })
    .sort((a, b) => sortBy === "newest" ? b.id - a.id : sortBy === "oldest" ? a.id - b.id : b.confidence_score - a.confidence_score)

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1400px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500", marginBottom: "4px" }}>Translation Records</p>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", margin: "0 0 4px" }}>History</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0 }}>{history.length} total translations · {filtered.length} shown</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleExportAll}
            style={{ padding: "8px 16px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontSize: "0.82rem", fontWeight: "500" }}>
            ⬇ Export All
          </button>
          <button onClick={() => setActivePage("translate")}
            style={{ padding: "8px 16px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontSize: "0.82rem", fontWeight: "600" }}>
            ⚡ New Translation
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: "0.85rem" }}>🔍</span>
          <input type="text" placeholder="Search programs or filenames..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.82rem", outline: "none", background: "white", color: "var(--text)" }}
            onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
        </div>

        <div style={{ display: "flex", gap: "4px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "3px" }}>
          {[
            { id: "all", label: "All" },
            { id: "high", label: "High (80%+)" },
            { id: "medium", label: "Medium" },
            { id: "low", label: "Low" },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: "5px 10px", border: "none", borderRadius: "5px", fontSize: "0.78rem", fontWeight: "500",
                background: filter === f.id ? "var(--primary)" : "transparent",
                color: filter === f.id ? "white" : "var(--text2)"
              }}>
              {f.label}
            </button>
          ))}
        </div>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.82rem", background: "white", color: "var(--text)", outline: "none" }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="confidence">By Confidence</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.4fr" : "1fr", gap: "20px" }}>

        {/* List */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--text3)" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "8px", animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</p>
              <p>Loading translations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--text3)", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
              <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📭</p>
              <p style={{ fontWeight: "600", marginBottom: "4px", color: "var(--text2)" }}>No translations found</p>
              <p style={{ fontSize: "0.82rem", marginBottom: "16px" }}>
                {search ? "Try a different search term" : "Upload your first COBOL file to get started"}
              </p>
              <button onClick={() => setActivePage("translate")}
                style={{ padding: "8px 16px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontSize: "0.82rem", fontWeight: "500" }}>
                Start Translating
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filtered.map((item, i) => (
                <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  style={{ background: "white", border: `1px solid ${selected?.id === item.id ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", padding: "14px 16px", cursor: "pointer", transition: "all 0.15s", animation: `fadeIn 0.3s ease ${i * 0.04}s both`, boxShadow: selected?.id === item.id ? "0 0 0 3px rgba(37,99,235,0.1)" : "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <div style={{ width: "28px", height: "28px", background: "var(--primary-light)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0 }}>⚡</div>
                        <p style={{ fontWeight: "600", margin: 0, fontSize: "0.875rem", color: "var(--text)", letterSpacing: "-0.2px" }}>{item.program_name}</p>
                        <span style={{ background: confidenceBg(item.confidence_score), color: confidenceColor(item.confidence_score), padding: "2px 7px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600", flexShrink: 0 }}>
                          {item.confidence_score}%
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "36px" }}>
                        <p style={{ color: "var(--text3)", margin: 0, fontSize: "0.75rem", fontFamily: "JetBrains Mono, monospace" }}>{item.filename}</p>
                        <p style={{ color: "var(--text4)", margin: 0, fontSize: "0.72rem" }}>
                          {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "12px" }}>
                      <button onClick={(e) => { e.stopPropagation(); handleDownload(item) }}
                        style={{ padding: "5px 10px", background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius-sm)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: "500" }}>
                        ⬇
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                        disabled={deleting === item.id}
                        style={{ padding: "5px 10px", background: "var(--red-light)", border: "1px solid #fecaca", borderRadius: "var(--radius-sm)", color: "var(--red)", fontSize: "0.72rem", fontWeight: "500" }}>
                        {deleting === item.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)", position: "sticky", top: "72px" }}>

              {/* Detail Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--text)" }}>{selected.program_name}</span>
                    <span style={{ background: confidenceBg(selected.confidence_score), color: confidenceColor(selected.confidence_score), padding: "2px 7px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600" }}>
                      {selected.confidence_score}% confidence
                    </span>
                  </div>
                  <p style={{ color: "var(--text3)", fontSize: "0.75rem", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>{selected.filename}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text2)", fontSize: "1rem", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                {[
                  { id: "code", label: "Generated API" },
                  { id: "analysis", label: "AI Analysis" },
                  { id: "meta", label: "Details" },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding: "10px 16px", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "var(--primary)" : "transparent"}`, background: "transparent", color: activeTab === tab.id ? "var(--primary)" : "var(--text2)", fontSize: "0.82rem", fontWeight: activeTab === tab.id ? "600" : "400", marginBottom: "-1px" }}>
                    {tab.label}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", gap: "6px", padding: "6px 12px", alignItems: "center" }}>
                  <button onClick={() => handleCopy(selected.generated_code)}
                    style={{ padding: "4px 10px", background: copied ? "var(--green-light)" : "white", border: `1px solid ${copied ? "#bbf7d0" : "var(--border)"}`, borderRadius: "var(--radius-sm)", color: copied ? "var(--green)" : "var(--text2)", fontSize: "0.75rem", fontWeight: "500" }}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                  <button onClick={() => handleDownload(selected)}
                    style={{ padding: "4px 10px", background: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "white", fontSize: "0.75rem", fontWeight: "600" }}>
                    ⬇ Download
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div style={{ padding: "16px" }}>
                {activeTab === "code" && (
                  <pre style={{ background: "var(--bg2)", padding: "14px", borderRadius: "var(--radius)", overflow: "auto", color: "#1e40af", fontSize: "0.75rem", lineHeight: "1.6", maxHeight: "480px", border: "1px solid var(--border)", margin: 0, fontFamily: "JetBrains Mono, monospace" }}>
                    {selected.generated_code}
                  </pre>
                )}

                {activeTab === "analysis" && (
                  <div>
                    <div style={{ background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius)", padding: "14px", marginBottom: "12px" }}>
                      <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--primary)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Understanding</p>
                      <p style={{ color: "var(--text2)", lineHeight: "1.7", fontSize: "0.85rem", margin: 0 }}>{selected.understanding}</p>
                    </div>
                    <div style={{ background: "var(--bg2)", borderRadius: "var(--radius)", padding: "12px", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--text3)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Confidence Score</p>
                      </div>
                      <div style={{ background: "var(--border)", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                        <div style={{ background: confidenceColor(selected.confidence_score), height: "100%", width: `${selected.confidence_score}%`, borderRadius: "4px", transition: "width 1s ease" }} />
                      </div>
                      <p style={{ color: confidenceColor(selected.confidence_score), fontSize: "1.2rem", fontWeight: "700", margin: "8px 0 0" }}>{selected.confidence_score}%</p>
                    </div>
                  </div>
                )}

                {activeTab === "meta" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Program Name", value: selected.program_name },
                      { label: "Source File", value: selected.filename },
                      { label: "Confidence Score", value: `${selected.confidence_score}%` },
                      { label: "Translation Date", value: new Date(selected.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                      { label: "Output Format", value: "FastAPI + Pydantic v2" },
                      { label: "AI Model", value: "Groq LLaMA 3.3 70B" },
                      { label: "Status", value: "✓ Completed" },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                        <span style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500" }}>{item.label}</span>
                        <span style={{ color: "var(--text)", fontSize: "0.8rem", fontWeight: "600", fontFamily: item.label === "Source File" ? "JetBrains Mono, monospace" : "inherit" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}