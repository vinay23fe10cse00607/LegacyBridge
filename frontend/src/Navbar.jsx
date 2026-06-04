export default function Navbar({ user, onLogout, activePage, setActivePage }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "translate", label: "Translate", icon: "⚡" },
    { id: "history", label: "History", icon: "◷" },
    { id: "playground", label: "Playground", icon: "◈" },
    { id: "apidocs", label: "API Docs", icon: "⊕" },
    { id: "pricing", label: "Pricing", icon: "◇" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ]

  return (
    <nav style={{ background: "white", borderBottom: "1px solid var(--border)", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-sm)" }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", minWidth: "160px" }} onClick={() => setActivePage("dashboard")}>
        <div style={{ width: "28px", height: "28px", background: "var(--primary)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>⚡</div>
        <span style={{ fontSize: "0.95rem", fontWeight: "700", letterSpacing: "-0.3px", color: "var(--text)" }}>LegacyBridge</span>
        <span style={{ background: "var(--primary-light)", color: "var(--primary)", fontSize: "0.65rem", fontWeight: "600", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.02em" }}>BETA</span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "2px" }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActivePage(item.id)}
            style={{ padding: "6px 12px", border: "none", borderRadius: "var(--radius)", fontSize: "0.82rem", fontWeight: "500", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "5px",
              background: activePage === item.id ? "var(--primary-light)" : "transparent",
              color: activePage === item.id ? "var(--primary)" : "var(--text2)"
            }}>
            <span style={{ fontSize: "0.75rem" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "160px", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.82rem", fontWeight: "600", margin: 0, color: "var(--text)" }}>{user?.name}</p>
          <p style={{ fontSize: "0.72rem", color: "var(--text3)", margin: 0 }}>Free Plan</p>
        </div>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "white", fontSize: "0.8rem", flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button onClick={onLogout}
          style={{ padding: "6px 12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", color: "var(--text2)", fontSize: "0.8rem", fontWeight: "500" }}>
          Logout
        </button>
      </div>
    </nav>
  )
}