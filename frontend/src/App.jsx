import { useState, useEffect } from "react"
import AuthPage from "./AuthPage"
import Navbar from "./Navbar"
import Dashboard from "./Dashboard"
import TranslatePage from "./TranslateePage"
import HistoryPage from "./HistoryPage"
import PlaygroundPage from "./PlaygroundPage"
import PricingPage from "./PricingPage"
import ApiDocsPage from "./ApiDocsPage"
import SettingsPage from "./SettingsPage"

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [activePage, setActivePage] = useState("dashboard")

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setToken(localStorage.getItem("token"))
    setActivePage("dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setToken(null)
  }

  if (!user) return <AuthPage onLogin={handleLogin} />

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg2)" }}>
      <Navbar
        user={user}
        onLogout={handleLogout}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <main>
        {activePage === "dashboard" && <Dashboard user={user} token={token} setActivePage={setActivePage} />}
        {activePage === "translate" && <TranslatePage token={token} setActivePage={setActivePage} />}
        {activePage === "history" && <HistoryPage token={token} setActivePage={setActivePage} />}
        {activePage === "playground" && <PlaygroundPage token={token} setActivePage={setActivePage} />}
        {activePage === "pricing" && <PricingPage setActivePage={setActivePage} />}
        {activePage === "apidocs" && <ApiDocsPage token={token} />}
        {activePage === "settings" && <SettingsPage user={user} token={token} onLogout={handleLogout} />}
      </main>
    </div>
  )
}