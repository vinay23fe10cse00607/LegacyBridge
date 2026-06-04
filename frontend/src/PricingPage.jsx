import { useState } from "react"

export default function PricingPage({ setActivePage }) {
  const [billing, setBilling] = useState("monthly")
  const [showPayment, setShowPayment] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" })
  const [upiId, setUpiId] = useState("")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for trying out LegacyBridge",
      color: "var(--text2)",
      bg: "var(--bg2)",
      border: "var(--border)",
      features: [
        "10 translations per month",
        "Basic COBOL support",
        "Download generated code",
        "Translation history (30 days)",
        "Community support",
      ],
      limits: [
        "No API access",
        "No batch processing",
        "No priority support",
      ],
      cta: "Current Plan",
      disabled: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 999, yearly: 799 },
      description: "For developers modernizing legacy systems",
      color: "var(--primary)",
      bg: "var(--primary-light)",
      border: "#bfdbfe",
      popular: true,
      features: [
        "500 translations per month",
        "Advanced COBOL dialects support",
        "REST API access",
        "Translation history (1 year)",
        "Priority email support",
        "Batch file processing",
        "Custom prompt templates",
        "Export to multiple formats",
        "Confidence score analytics",
        "Team collaboration (5 members)",
      ],
      cta: "Upgrade to Pro",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 4999, yearly: 3999 },
      description: "For organizations with large-scale modernization",
      color: "var(--purple)",
      bg: "var(--purple-light)",
      border: "#ddd6fe",
      features: [
        "Unlimited translations",
        "All COBOL dialects",
        "Full API access + webhooks",
        "Unlimited history",
        "24/7 dedicated support",
        "Unlimited batch processing",
        "Custom AI fine-tuning",
        "SSO/SAML authentication",
        "SLA guarantee (99.9%)",
        "Unlimited team members",
        "On-premise deployment option",
        "Custom integrations",
      ],
      cta: "Contact Sales",
    },
  ]

  const handlePayment = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 2500))
    setProcessing(false)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setShowPayment(null)
    }, 3000)
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: "600", letterSpacing: "0.1em", marginBottom: "8px", textTransform: "uppercase" }}>Pricing</p>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700", letterSpacing: "-1px", margin: "0 0 12px" }}>Simple, transparent pricing</h1>
        <p style={{ color: "var(--text2)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto 28px", lineHeight: "1.6" }}>
          Start free. Upgrade when you need more. No hidden fees, no surprises.
        </p>

        {/* Billing Toggle */}
        <div style={{ display: "inline-flex", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "4px", gap: "4px" }}>
          {["monthly", "yearly"].map((b) => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ padding: "8px 20px", border: "none", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", fontWeight: "500", transition: "all 0.15s", background: billing === b ? "white" : "transparent", color: billing === b ? "var(--text)" : "var(--text3)", boxShadow: billing === b ? "var(--shadow)" : "none" }}>
              {b.charAt(0).toUpperCase() + b.slice(1)}
              {b === "yearly" && <span style={{ marginLeft: "6px", background: "var(--green-light)", color: "var(--green)", fontSize: "0.7rem", padding: "1px 6px", borderRadius: "4px", fontWeight: "600" }}>-20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "48px" }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ background: "white", border: `1px solid ${plan.popular ? plan.border : "var(--border)"}`, borderRadius: "var(--radius-xl)", padding: "28px", position: "relative", boxShadow: plan.popular ? "var(--shadow-lg)" : "var(--shadow-sm)", transform: plan.popular ? "scale(1.02)" : "none", transition: "transform 0.2s" }}>

            {plan.popular && (
              <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "var(--primary)", color: "white", fontSize: "0.72rem", fontWeight: "700", padding: "4px 14px", borderRadius: "20px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Most Popular
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "32px", height: "32px", background: plan.bg, border: `1px solid ${plan.border}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                  {plan.id === "free" ? "◇" : plan.id === "pro" ? "◆" : "★"}
                </div>
                <span style={{ fontWeight: "700", fontSize: "1rem", color: plan.color }}>{plan.name}</span>
              </div>
              <p style={{ color: "var(--text3)", fontSize: "0.82rem", margin: "0 0 16px", lineHeight: "1.5" }}>{plan.description}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: "700", color: "var(--text)", letterSpacing: "-1px" }}>
                  {plan.price.monthly === 0 ? "Free" : `₹${billing === "monthly" ? plan.price.monthly : plan.price.yearly}`}
                </span>
                {plan.price.monthly > 0 && <span style={{ color: "var(--text3)", fontSize: "0.85rem" }}>/month</span>}
              </div>
              {billing === "yearly" && plan.price.monthly > 0 && (
                <p style={{ color: "var(--green)", fontSize: "0.78rem", margin: "4px 0 0", fontWeight: "500" }}>
                  Save ₹{(plan.price.monthly - plan.price.yearly) * 12}/year
                </p>
              )}
            </div>

            <button
              onClick={() => !plan.disabled && plan.id !== "enterprise" && setShowPayment(plan)}
              style={{ width: "100%", padding: "11px", background: plan.disabled ? "var(--bg2)" : plan.popular ? "var(--primary)" : "white", border: plan.disabled ? "1px solid var(--border)" : plan.popular ? "none" : `1px solid ${plan.border}`, borderRadius: "var(--radius)", color: plan.disabled ? "var(--text3)" : plan.popular ? "white" : plan.color, fontWeight: "600", fontSize: "0.875rem", marginBottom: "20px", transition: "all 0.15s", cursor: plan.disabled ? "default" : "pointer", boxShadow: plan.popular ? "0 1px 2px rgba(37,99,235,0.3)" : "none" }}>
              {plan.cta}
            </button>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--text3)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>What's included</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.82rem", color: "var(--text2)" }}>
                    <span style={{ color: "var(--green)", marginTop: "1px", flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
                {plan.limits?.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.82rem", color: "var(--text4)" }}>
                    <span style={{ marginTop: "1px", flexShrink: 0 }}>✗</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "32px", marginBottom: "32px", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: "0 0 24px", letterSpacing: "-0.3px" }}>Frequently Asked Questions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[
            { q: "Can I change plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." },
            { q: "What COBOL dialects are supported?", a: "Free supports standard COBOL. Pro and Enterprise support IBM COBOL, Micro Focus, COBOL-IT and more." },
            { q: "Is my code secure?", a: "All files are processed securely and deleted immediately after translation. We never store your source code." },
            { q: "Do you offer refunds?", a: "Yes, we offer a 7-day money-back guarantee on all paid plans, no questions asked." },
            { q: "Can I use the API?", a: "API access is available on Pro and Enterprise plans. Full documentation is included." },
            { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, UPI, and net banking for Indian customers." },
          ].map((item) => (
            <div key={item.q} style={{ padding: "16px", background: "var(--bg2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <p style={{ fontWeight: "600", fontSize: "0.875rem", margin: "0 0 6px", color: "var(--text)" }}>{item.q}</p>
              <p style={{ color: "var(--text2)", fontSize: "0.82rem", margin: 0, lineHeight: "1.6" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>

            {/* Modal Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: "700", fontSize: "1rem", margin: 0 }}>Upgrade to {showPayment.name}</p>
                <p style={{ color: "var(--text3)", fontSize: "0.78rem", margin: "2px 0 0" }}>
                  ₹{billing === "monthly" ? showPayment.price.monthly : showPayment.price.yearly}/month · Billed {billing}
                </p>
              </div>
              <button onClick={() => setShowPayment(null)} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "50%", width: "32px", height: "32px", fontSize: "1rem", color: "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            </div>

            {success ? (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
                <p style={{ fontWeight: "700", fontSize: "1.1rem", margin: "0 0 8px", color: "var(--green)" }}>Payment Successful!</p>
                <p style={{ color: "var(--text2)", fontSize: "0.875rem", margin: 0 }}>Welcome to {showPayment.name}! Your account has been upgraded.</p>
              </div>
            ) : (
              <div style={{ padding: "24px" }}>

                {/* Order Summary */}
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text2)" }}>LegacyBridge {showPayment.name}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: "600" }}>₹{billing === "monthly" ? showPayment.price.monthly : showPayment.price.yearly}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text2)" }}>GST (18%)</span>
                    <span style={{ fontSize: "0.82rem" }}>₹{Math.round((billing === "monthly" ? showPayment.price.monthly : showPayment.price.yearly) * 0.18)}</span>
                  </div>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "6px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>Total</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--primary)" }}>
                      ₹{Math.round((billing === "monthly" ? showPayment.price.monthly : showPayment.price.yearly) * 1.18)}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[
                    { id: "card", label: "Card" },
                    { id: "upi", label: "UPI" },
                    { id: "netbanking", label: "Net Banking" },
                  ].map((m) => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      style={{ flex: 1, padding: "8px", border: `1px solid ${paymentMethod === m.id ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius)", background: paymentMethod === m.id ? "var(--primary-light)" : "white", color: paymentMethod === m.id ? "var(--primary)" : "var(--text2)", fontSize: "0.82rem", fontWeight: paymentMethod === m.id ? "600" : "400" }}>
                      {m.id === "card" ? "💳" : m.id === "upi" ? "📱" : "🏦"} {m.label}
                    </button>
                  ))}
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>Card Number</label>
                      <input placeholder="1234 5678 9012 3456" value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", fontFamily: "JetBrains Mono, monospace" }}
                        onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>Expiry</label>
                        <input placeholder="MM/YY" value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", fontFamily: "JetBrains Mono, monospace" }}
                          onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                          onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>CVV</label>
                        <input placeholder="•••" type="password" value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", fontFamily: "JetBrains Mono, monospace" }}
                          onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                          onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>Name</label>
                        <input placeholder="Full Name" value={cardForm.name}
                          onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                          style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none" }}
                          onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                          onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Form */}
                {paymentMethod === "upi" && (
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: "500", color: "var(--text2)", display: "block", marginBottom: "4px" }}>UPI ID</label>
                    <input placeholder="yourname@upi" value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.875rem", outline: "none", marginBottom: "12px" }}
                      onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["@okaxis", "@ybl", "@paytm", "@upi"].map((suffix) => (
                        <button key={suffix} onClick={() => setUpiId(prev => prev.split("@")[0] + suffix)}
                          style={{ padding: "4px 10px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "0.72rem", color: "var(--text2)", fontWeight: "500" }}>
                          {suffix}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === "netbanking" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((bank) => (
                      <button key={bank}
                        style={{ padding: "10px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "0.82rem", fontWeight: "500", color: "var(--text2)", textAlign: "left" }}>
                        🏦 {bank} Bank
                      </button>
                    ))}
                  </div>
                )}

                <button onClick={handlePayment} disabled={processing}
                  style={{ width: "100%", padding: "12px", background: processing ? "var(--bg3)" : "var(--primary)", border: "none", borderRadius: "var(--radius)", color: processing ? "var(--text3)" : "white", fontWeight: "600", fontSize: "0.9rem", marginTop: "16px", transition: "all 0.15s" }}>
                  {processing ? "Processing payment..." : `Pay ₹${Math.round((billing === "monthly" ? showPayment.price.monthly : showPayment.price.yearly) * 1.18)}`}
                </button>

                <p style={{ textAlign: "center", color: "var(--text4)", fontSize: "0.72rem", marginTop: "10px" }}>
                  🔒 Secured by 256-bit SSL encryption · PCI DSS compliant
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}