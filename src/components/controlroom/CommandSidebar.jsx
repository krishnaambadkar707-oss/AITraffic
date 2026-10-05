import React from "react";
import { Map, AlertOctagon, Flame, Users, Zap, Siren, Radio } from "lucide-react";

export default function CommandSidebar({
  activeSubView,
  setActiveSubView,
  setViewMode,
  onOpenDispatchModal,
  onOpenSystemStatusModal
}) {
  const menuItems = [
    { id: "MAP_OVERVIEW", label: "MAP OVERVIEW", icon: Map },
    { id: "RISK_HEATMAP", label: "RISK HEATMAP", icon: Flame },
    { id: "SIMULATION", label: "SIMULATION", icon: Zap }
  ];

  return (
    <aside style={{
      width: "250px",
      height: "100%",
      background: "linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(45, 212, 191, 0.3)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "1rem 0.85rem",
      zIndex: 950,
      boxShadow: "4px 0 40px rgba(13, 148, 136, 0.2)",
      "--text-primary": "#F8FAFC",
      "--text-secondary": "#94A3B8",
      "--text-muted": "#64748B",
      "--border-color": "rgba(45, 212, 191, 0.3)",
      "--bg-panel": "rgba(15, 23, 42, 0.6)",
      "--accent-cyan": "#2DD4BF",
      "--accent-cyan-bg": "rgba(45, 212, 191, 0.15)",
      "--bg-card": "rgba(2, 6, 23, 0.6)"
    }}>
      {/* Top Header */}
      <div>
        <div style={{
          paddingBottom: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid var(--border-color)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "900",
              color: "var(--text-primary)",
              fontFamily: "var(--font-tech)",
              letterSpacing: "0.08em",
              margin: 0
            }}>
              COMMAND
            </h2>
            <span style={{
              background: "var(--risk-low-bg)",
              color: "var(--risk-low)",
              border: "1px solid var(--risk-low)",
              fontSize: "0.65rem",
              fontWeight: "700",
              fontFamily: "var(--font-mono)",
              padding: "0.15rem 0.45rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--risk-low)" }}></span>
              V2.0 Active
            </span>
          </div>

          <button
            onClick={() => setViewMode && setViewMode("LANDING")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.65rem 0.85rem",
              borderRadius: "6px",
              border: "1px solid var(--accent-cyan)",
              background: "var(--accent-cyan-bg)",
              color: "var(--accent-cyan)",
              fontFamily: "var(--font-heading)",
              fontSize: "0.85rem",
              fontWeight: "800",
              letterSpacing: "0.04em",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.18s ease"
            }}
          >
            <span style={{ display: "inline-block", fontSize: "16px" }}>🏠</span>
            <span>BACK TO HOME</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubView(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "6px",
                  border: isActive ? "1px solid var(--accent-cyan)" : "1px solid transparent",
                  background: isActive
                    ? "var(--accent-cyan-bg)"
                    : "transparent",
                  color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? "800" : "600",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.18s ease"
                }}
              >
                <Icon style={{ width: "17px", height: "17px", color: isActive ? "var(--accent-cyan)" : "var(--text-muted)" }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Dispatch & System Status Actions */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        paddingTop: "1rem",
        borderTop: "1px solid var(--border-color)"
      }}>
        {/* Red Dispatch Button */}
        <button
          onClick={onOpenDispatchModal}
          className="btn-danger"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "0.65rem",
            fontSize: "0.85rem",
            borderRadius: "8px"
          }}
        >
          <Siren style={{ width: "18px", height: "18px" }} />
          <span>✳ DISPATCH</span>
        </button>

        {/* System Status Button */}
        <button
          onClick={onOpenSystemStatusModal}
          style={{
            width: "100%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
            padding: "0.5rem",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <Radio style={{ width: "14px", height: "14px", color: "var(--accent-cyan)" }} />
          <span>((•)) SYSTEM STATUS</span>
        </button>
      </div>
    </aside>
  );
}
