import { useState } from "react"
import axios from "axios"

const API_URL = "https://legacybridge.onrender.com"

export default function SettingsPage({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" })
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState({
    emailTranslations: true,
    emailWeekly: false,
    emailMarketing: false,
    browserNotifs: true,
  })
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "api", label: "API Access", icon: "⚡" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ]

  return (
    <div style={{ padding: "32px 40px", maxWidth: "1000px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: "500", marginBottom: "4px" }}>Account</p>
        <h1 style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "-0.5px", margin: "0 0 4px" }}>Settings</h1>
        <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0 }}>Manage your account preferences and security</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "20px" }}>

        {/* Sidebar */}
        <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "8px", height: "fit-content", boxShadow: "var(--shadow-sm)", position: "sticky", top: "72px" }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ width: "100%", padding: "9px 12px", border: "none", borderRadius: "var(--radius)", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", transition: "all 0.15s", fontSize: "0.82rem",
                background: activeTab === tab.id ? "var(--primary-light)" : "transparent",
                color: activeTab === tab.id ? "var(--primary)" : tab.id === "danger" ? "var(--red)" : "var(--text2)",
                fontWeight: activeTab === tab.id ? "600" : "400"
              }}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Profile */}
          {activeTab === "profile" && (
            <>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 20px" }}>Profile Information</h2>

                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", padding: "16px", background: "var(--bg2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "700", color: "white", flexShrink: 0 }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: "600", fontSize: "0.95rem", margin: "0 0 2px" }}>{user?.name}</p>
                    <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: "0 0 8px" }}>{user?.email}</p>
                    <span style={{ background: "var(--primary-light)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>Free Plan</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Full Name</label>
                    <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", background: "var(--bg)" }}
                      onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Email Address</label>
                    <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", background: "var(--bg)" }}
                      onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Organization (Optional)</label>
                    <input placeholder="Manipal University Jaipur"
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", background: "var(--bg)" }}
                      onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>Role (Optional)</label>
                    <select style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", background: "var(--bg)", color: "var(--text)" }}>
                      <option>Software Engineer</option>
                      <option>Student</option>
                      <option>DevOps Engineer</option>
                      <option>Enterprise Architect</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                {saved && <span style={{ color: "var(--green)", fontSize: "0.82rem", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>✓ Changes saved</span>}
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: "9px 20px", background: saving ? "var(--bg3)" : "var(--primary)", border: "none", borderRadius: "var(--radius)", color: saving ? "var(--text3)" : "white", fontWeight: "600", fontSize: "0.875rem" }}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 20px" }}>Change Password</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { key: "current", label: "Current Password", placeholder: "Enter current password" },
                    { key: "newPass", label: "New Password", placeholder: "Enter new password" },
                    { key: "confirm", label: "Confirm New Password", placeholder: "Confirm new password" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: "0.8rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "6px" }}>{field.label}</label>
                      <input type="password" placeholder={field.placeholder}
                        value={passwordForm[field.key]}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} style={{ marginTop: "16px", padding: "9px 20px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontWeight: "600", fontSize: "0.875rem" }}>
                  Update Password
                </button>
              </div>

              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 8px" }}>Two-Factor Authentication</h2>
                <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: "0 0 16px" }}>Add an extra layer of security to your account</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px", background: "var(--bg2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 2px" }}>Authenticator App</p>
                    <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: 0 }}>Use Google Authenticator or Authy</p>
                  </div>
                  <button style={{ padding: "7px 14px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontSize: "0.78rem", fontWeight: "600" }}>Enable</button>
                </div>
              </div>

              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 16px" }}>Active Sessions</h2>
                {[
                  { device: "Chrome on Windows", location: "Rohtak, Haryana", time: "Current session", current: true },
                  { device: "Mobile App", location: "Jaipur, Rajasthan", time: "2 days ago", current: false },
                ].map((session, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg2)", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.2rem" }}>💻</span>
                      <div>
                        <p style={{ fontWeight: "600", fontSize: "0.82rem", margin: "0 0 2px" }}>{session.device}</p>
                        <p style={{ color: "var(--text3)", fontSize: "0.72rem", margin: 0 }}>{session.location} · {session.time}</p>
                      </div>
                    </div>
                    {session.current
                      ? <span style={{ background: "var(--green-light)", color: "var(--green)", fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>Active</span>
                      : <button style={{ padding: "4px 10px", background: "var(--red-light)", border: "1px solid #fecaca", borderRadius: "var(--radius-sm)", color: "var(--red)", fontSize: "0.72rem", fontWeight: "500" }}>Revoke</button>
                    }
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 20px" }}>Notification Preferences</h2>
              {[
                { key: "emailTranslations", label: "Translation Complete", desc: "Get notified when a translation finishes" },
                { key: "emailWeekly", label: "Weekly Summary", desc: "Weekly report of your translation activity" },
                { key: "emailMarketing", label: "Product Updates", desc: "New features and product announcements" },
                { key: "browserNotifs", label: "Browser Notifications", desc: "Real-time notifications in your browser" },
              ].map((item) => (
                <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 2px" }}>{item.label}</p>
                    <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: 0 }}>{item.desc}</p>
                  </div>
                  <div
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    style={{ width: "42px", height: "22px", borderRadius: "11px", background: notifications[item.key] ? "var(--primary)" : "var(--bg4)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: notifications[item.key] ? "22px" : "2px", transition: "left 0.2s", boxShadow: "var(--shadow-sm)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API */}
          {activeTab === "api" && (
            <>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 8px" }}>Your API Token</h2>
                <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: "0 0 16px" }}>Use this token to authenticate API requests</p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type={apiKeyVisible ? "text" : "password"}
                    value={token}
                    readOnly
                    style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.78rem", fontFamily: "JetBrains Mono, monospace", background: "var(--bg2)", color: "var(--text2)", outline: "none" }}
                  />
                  <button onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    style={{ padding: "9px 14px", background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontSize: "0.78rem", fontWeight: "500" }}>
                    {apiKeyVisible ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(token)}
                    style={{ padding: "9px 14px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontSize: "0.78rem", fontWeight: "600" }}>
                    Copy
                  </button>
                </div>
                <div style={{ background: "var(--yellow-light)", border: "1px solid #fde68a", borderRadius: "var(--radius)", padding: "10px 12px", fontSize: "0.78rem", color: "var(--yellow)" }}>
                  ⚠️ Keep your token secret. Never share it publicly or commit it to version control.
                </div>
              </div>

              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 8px" }}>API Usage</h2>
                <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: "0 0 16px" }}>Current plan: Free · 10 requests/month</p>
                <div style={{ background: "var(--bg2)", borderRadius: "var(--radius)", height: "8px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ background: "var(--primary)", height: "100%", width: "30%", borderRadius: "4px" }} />
                </div>
                <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: 0 }}>3 of 10 requests used this month</p>
              </div>

              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 16px" }}>Code Examples</h2>
                <pre style={{ background: "#1e1e2e", padding: "16px", borderRadius: "var(--radius)", overflow: "auto", fontSize: "0.78rem", lineHeight: "1.6", fontFamily: "JetBrains Mono, monospace", margin: 0 }}>
                  <span style={{ color: "#888" }}># Python example</span>{"\n"}
                  <span style={{ color: "#79c0ff" }}>import</span>
                  <span style={{ color: "#e6edf3" }}> requests{"\n\n"}</span>
                  <span style={{ color: "#e6edf3" }}>response = requests.post({"\n"}</span>
                  <span style={{ color: "#e6edf3" }}>    </span>
                  <span style={{ color: "#a5d6ff" }}>"https://legacybridge.onrender.com/translate"</span>
                  <span style={{ color: "#e6edf3" }}>,{"\n"}</span>
                  <span style={{ color: "#e6edf3" }}>    headers=</span>
                  <span style={{ color: "#e6edf3" }}>{"{"}</span>
                  <span style={{ color: "#a5d6ff" }}>"Authorization"</span>
                  <span style={{ color: "#e6edf3" }}>: </span>
                  <span style={{ color: "#a5d6ff" }}>"Bearer YOUR_TOKEN"</span>
                  <span style={{ color: "#e6edf3" }}>{"}"}</span>
                  <span style={{ color: "#e6edf3" }}>,{"\n"}</span>
                  <span style={{ color: "#e6edf3" }}>    files=</span>
                  <span style={{ color: "#e6edf3" }}>{"{"}</span>
                  <span style={{ color: "#a5d6ff" }}>"file"</span>
                  <span style={{ color: "#e6edf3" }}>: open(</span>
                  <span style={{ color: "#a5d6ff" }}>"program.cbl"</span>
                  <span style={{ color: "#e6edf3" }}>, </span>
                  <span style={{ color: "#a5d6ff" }}>"rb"</span>
                  <span style={{ color: "#e6edf3" }}>){"}"}{"\n"}</span>
                  <span style={{ color: "#e6edf3" }}>){"\n"}</span>
                  <span style={{ color: "#e6edf3" }}>print(response.json())</span>
                </pre>
              </div>
            </>
          )}

          {/* Billing */}
          {activeTab === "billing" && (
            <>
              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: 0 }}>Current Plan</h2>
                  <span style={{ background: "var(--primary-light)", color: "var(--primary)", fontSize: "0.72rem", fontWeight: "600", padding: "3px 10px", borderRadius: "4px" }}>FREE</span>
                </div>
                <div style={{ background: "var(--bg2)", borderRadius: "var(--radius-lg)", padding: "16px", marginBottom: "16px", border: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: "700", fontSize: "1.2rem", margin: "0 0 4px" }}>Free Plan</p>
                  <p style={{ color: "var(--text3)", fontSize: "0.82rem", margin: "0 0 12px" }}>10 translations per month · Basic features</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {["10 translations/month", "Basic COBOL support", "Translation history", "Download code"].map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--text2)" }}>
                        <span style={{ color: "var(--green)" }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveTab("pricing")}
                  style={{ padding: "9px 20px", background: "var(--primary)", border: "none", borderRadius: "var(--radius)", color: "white", fontWeight: "600", fontSize: "0.875rem" }}>
                  Upgrade to Pro →
                </button>
              </div>

              <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 16px" }}>Billing History</h2>
                <div style={{ textAlign: "center", padding: "32px", color: "var(--text3)" }}>
                  <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📄</p>
                  <p style={{ fontSize: "0.82rem" }}>No billing history yet. Upgrade to a paid plan to see invoices.</p>
                </div>
              </div>
            </>
          )}

          {/* Danger Zone */}
          {activeTab === "danger" && (
            <>
              <div style={{ background: "white", border: "1px solid #fecaca", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", margin: "0 0 8px", color: "var(--red)" }}>⚠️ Danger Zone</h2>
                <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: "0 0 20px" }}>These actions are irreversible. Please proceed with caution.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { title: "Clear Translation History", desc: "Permanently delete all your translation records. This cannot be undone.", btn: "Clear History", color: "var(--yellow)" },
                    { title: "Export All Data", desc: "Download all your data including translations and account information.", btn: "Export Data", color: "var(--primary)" },
                    { title: "Delete Account", desc: "Permanently delete your account and all associated data. This action cannot be reversed.", btn: "Delete Account", color: "var(--red)" },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--bg2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                      <div style={{ flex: 1, marginRight: "16px" }}>
                        <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 4px", color: item.color }}>{item.title}</p>
                        <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: 0, lineHeight: "1.5" }}>{item.desc}</p>
                      </div>
                      <button style={{ padding: "7px 14px", background: "white", border: `1px solid ${item.color}`, borderRadius: "var(--radius)", color: item.color, fontSize: "0.78rem", fontWeight: "600", flexShrink: 0, cursor: "pointer" }}>
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}