import { useState, useEffect } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const API_URL = "https://legacybridge.onrender.com"

export default function Dashboard({ user, token, setActivePage }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const usagePercent = Math.min(((stats?.total_translations || 0) / 10) * 100, 100)

  const barData = stats?.programs?.slice(0, 6).map((p, i) => ({
    name: p.length > 10 ? p.slice(0, 10) + "..." : p,
    confidence: Math.floor(70 + Math.random() * 30)
  })) || []

  const pieData = [
    { name: "Used", value: stats?.total_translations || 0, color: "#2563eb" },
    { name: "Remaining", value: Math.max(10 - (stats?.total_translations || 0), 0), color: "#e9ecef" }
  ]

  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    translations: Math.floor(Math.random() * 5)
  }))

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1400px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <p style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500", marginBottom: "4px" }}>Welcome back</p>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", margin: 0 }}>{user?.name} 👋</h1>
          <p style={{ color: "var(--text2)", marginTop: "4px", fontSize: "0.875rem" }}>Here's your translation overview for today</p>
        </div>
        <button onClick={() => setActivePage("translate")}
          style={{ padding: "10px 20px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontWeight: "600", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 1px 2px rgba(37,99,235,0.3)" }}>
          ⚡ New Translation
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Translations", value: loading ? "—" : stats?.total_translations || 0, change: "+2 this week", color: "var(--primary)", bg: "var(--primary-light)", icon: "⚡" },
          { label: "Avg Confidence", value: loading ? "—" : `${stats?.avg_confidence || 0}%`, change: "Above industry avg", color: "var(--green)", bg: "var(--green-light)", icon: "◎" },
          { label: "Highest Score", value: loading ? "—" : `${stats?.highest_confidence || 0}%`, change: "Personal best", color: "var(--purple)", bg: "var(--purple-light)", icon: "◆" },
          { label: "Programs Done", value: loading ? "—" : stats?.programs?.length || 0, change: "Unique programs", color: "var(--yellow)", bg: "var(--yellow-light)", icon: "▦" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <p style={{ color: "var(--text2)", fontSize: "0.8rem", fontWeight: "500", margin: 0 }}>{s.label}</p>
              <div style={{ width: "32px", height: "32px", background: s.bg, borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>{s.icon}</div>
            </div>
            <p style={{ fontSize: "1.8rem", fontWeight: "700", color: s.color, margin: "0 0 6px", letterSpacing: "-1px" }}>{s.value}</p>
            <p style={{ color: "var(--text3)", fontSize: "0.75rem", margin: 0 }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>

        {/* Activity Chart */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: 0 }}>Translation Activity</p>
              <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: "2px 0 0" }}>Last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barSize={24}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#868e96" }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "white", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="translations" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Usage Meter */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 4px" }}>Monthly Usage</p>
          <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: "0 0 20px" }}>Free plan limit</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <PieChart width={120} height={120}>
              <Pie data={pieData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="value" startAngle={90} endAngle={-270}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
              </Pie>
            </PieChart>
          </div>
          <p style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: "700", color: "var(--primary)", margin: "0 0 4px" }}>
            {stats?.total_translations || 0}/10
          </p>
          <p style={{ textAlign: "center", color: "var(--text3)", fontSize: "0.78rem", margin: "0 0 12px" }}>translations used</p>
          <button onClick={() => setActivePage("pricing")}
            style={{ width: "100%", padding: "8px", background: "var(--primary-light)", border: "1px solid #bfdbfe", borderRadius: "var(--radius)", color: "var(--primary)", fontWeight: "600", fontSize: "0.8rem" }}>
            Upgrade Plan →
          </button>
        </div>

        {/* Confidence Distribution */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 4px" }}>Confidence Scores</p>
          <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: "0 0 20px" }}>By range</p>
          {[
            { label: "90-100%", count: 2, color: "var(--green)" },
            { label: "80-89%", count: 4, color: "var(--primary)" },
            { label: "70-79%", count: 2, color: "var(--yellow)" },
            { label: "< 70%", count: 1, color: "var(--red)" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text2)", fontWeight: "500" }}>{item.label}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{item.count}</span>
              </div>
              <div style={{ background: "var(--bg3)", borderRadius: "4px", height: "6px" }}>
                <div style={{ background: item.color, height: "100%", borderRadius: "4px", width: `${(item.count / 9) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Quick Actions */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 16px" }}>Quick Actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { label: "New Translation", icon: "⚡", page: "translate", color: "var(--primary)", bg: "var(--primary-light)" },
              { label: "View History", icon: "◷", page: "history", color: "var(--purple)", bg: "var(--purple-light)" },
              { label: "Playground", icon: "◈", page: "playground", color: "var(--green)", bg: "var(--green-light)" },
              { label: "API Docs", icon: "⊕", page: "apidocs", color: "var(--yellow)", bg: "var(--yellow-light)" },
              { label: "Pricing", icon: "◇", page: "pricing", color: "var(--red)", bg: "var(--red-light)" },
              { label: "Settings", icon: "⚙", page: "settings", color: "var(--text2)", bg: "var(--bg3)" },
            ].map((action) => (
              <button key={action.label} onClick={() => setActivePage(action.page)}
                style={{ padding: "12px", background: action.bg, border: `1px solid ${action.bg}`, borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", fontWeight: "500", color: action.color, textAlign: "left" }}>
                <span>{action.icon}</span> {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Programs */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: 0 }}>Recent Programs</p>
            <button onClick={() => setActivePage("history")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.78rem", fontWeight: "500", cursor: "pointer" }}>View all →</button>
          </div>
          {!stats?.programs?.length ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--text3)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "8px" }}>📭</p>
              <p style={{ fontSize: "0.85rem", marginBottom: "12px" }}>No translations yet</p>
              <button onClick={() => setActivePage("translate")}
                style={{ padding: "8px 16px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontSize: "0.82rem", fontWeight: "500" }}>
                Start translating
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.programs.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--bg2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", background: "var(--primary-light)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>⚡</div>
                    <span style={{ fontSize: "0.82rem", fontWeight: "500", color: "var(--text)" }}>{p}</span>
                  </div>
                  <span style={{ fontSize: "0.72rem", background: "var(--green-light)", color: "var(--green)", padding: "2px 8px", borderRadius: "4px", fontWeight: "500" }}>Translated</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}