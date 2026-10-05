import React from "react";
import { Shield, Activity, Users, Clock, Map, Brain, Wrench, AlertTriangle, ArrowRight } from "lucide-react";

export default function LandingPage({ setViewMode }) {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      /* A vibrant Teal-to-Deep-Blue gradient over the city to simulate a bright, high-tech daytime/cyan feel */
      background: "linear-gradient(135deg, rgba(20, 184, 166, 0.85) 0%, rgba(30, 58, 138, 0.95) 100%), url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80') center/cover",
      color: "#F8FAFC",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-primary)",
      overflow: "hidden"
    }}>
      {/* Top Header */}
      <header style={{
        padding: "1.5rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(45, 212, 191, 0.3)",
        background: "rgba(2, 6, 23, 0.3)",
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2DD4BF 0%, #3B82F6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(45, 212, 191, 0.3)"
          }}>
            <Shield style={{ color: "#0F172A", width: "26px", height: "26px" }} />
          </div>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: "900",
            letterSpacing: "0.1em",
            margin: 0,
            fontFamily: "var(--font-tech)",
            color: "#F0FDFA",
            textShadow: "0 2px 10px rgba(45, 212, 191, 0.5)"
          }}>
            NAGPUR POLICE
          </h1>
        </div>
        
        <nav style={{
          display: "flex",
          gap: "2.5rem",
          fontSize: "0.85rem",
          fontWeight: "800",
          letterSpacing: "0.06em",
          color: "#94A3B8"
        }}>
          <span onClick={() => setViewMode("LANDING")} style={{ color: "#2DD4BF", borderBottom: "3px solid #2DD4BF", paddingBottom: "4px", cursor: "pointer" }}>HOME</span>
          <span onClick={() => setViewMode("CONTROL_ROOM")} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#2DD4BF"} onMouseOut={e => e.target.style.color = "#94A3B8"}>CONTROL ROOM</span>
          <span onClick={() => setViewMode("INCIDENT_LOGS")} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#2DD4BF"} onMouseOut={e => e.target.style.color = "#94A3B8"}>INCIDENT LOGS</span>
          <span onClick={() => setViewMode("CITIZEN")} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#2DD4BF"} onMouseOut={e => e.target.style.color = "#94A3B8"}>CITIZEN REPORTING</span>
          <span onClick={() => setViewMode("ANALYTICS")} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#2DD4BF"} onMouseOut={e => e.target.style.color = "#94A3B8"}>ANALYTICS</span>
          <span onClick={() => setViewMode("DEPLOYMENT")} style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#2DD4BF"} onMouseOut={e => e.target.style.color = "#94A3B8"}>DEPLOYMENT</span>
        </nav>
      </header>

      {/* Live City Pulse Bar */}
      <div style={{
        background: "linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.2) 100%)",
        backdropFilter: "blur(16px)",
        padding: "0.85rem 3rem",
        display: "flex",
        alignItems: "center",
        gap: "3rem",
        borderBottom: "1px solid rgba(45, 212, 191, 0.2)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        fontSize: "0.85rem",
        fontFamily: "var(--font-mono)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: "800", color: "#2DD4BF" }}>
          <Activity style={{ width: "18px", height: "18px", color: "#34D399" }} />
          LIVE CITY PULSE
        </div>
        <div style={{ display: "flex", gap: "2.5rem", color: "#F1F5F9" }}>
          <span>Overall Risk: <span style={{ color: "#FDA4AF", fontWeight: "800", background: "rgba(225, 29, 72, 0.3)", padding: "2px 8px", borderRadius: "12px" }}>HIGH (Citywide)</span></span>
          <span>Active Units: <span style={{ color: "#6EE7B7", fontWeight: "800", background: "rgba(5, 150, 105, 0.3)", padding: "2px 8px", borderRadius: "12px" }}>43</span></span>
          <span>Avg Response: <span style={{ color: "#93C5FD", fontWeight: "800", background: "rgba(37, 99, 235, 0.3)", padding: "2px 8px", borderRadius: "12px" }}>4.2m</span></span>
        </div>
      </div>

      {/* Main Content Centered */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "4rem",
          fontWeight: "900",
          fontFamily: "var(--font-heading)",
          marginBottom: "1rem",
          lineHeight: "1.15",
          maxWidth: "1150px",
          background: "linear-gradient(135deg, #CCFBF1 0%, #2DD4BF 50%, #3B82F6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0px 10px 30px rgba(45, 212, 191, 0.2)"
        }}>
          NAGPUR TRAFFIC RISK & DEPLOYMENT<br/>DECISION SUPPORT SYSTEM
        </h2>
        
        <p style={{
          fontSize: "1.3rem",
          color: "#99F6E4",
          marginBottom: "2.5rem",
          fontWeight: "700",
          letterSpacing: "0.04em"
        }}>
          AI-Driven Proactive Policing for a Safer, Smarter Nagpur
        </p>

        <button 
          onClick={() => setViewMode("CONTROL_ROOM")}
          style={{
            background: "linear-gradient(135deg, #0D9488 0%, #1D4ED8 100%)",
            border: "1px solid #2DD4BF",
            borderRadius: "12px",
            padding: "1.2rem 3.5rem",
            fontSize: "1.1rem",
            fontWeight: "800",
            color: "#F8FAFC",
            cursor: "pointer",
            fontFamily: "var(--font-tech)",
            letterSpacing: "0.06em",
            boxShadow: "0 10px 30px rgba(45, 212, 191, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            marginBottom: "3.5rem"
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(45, 212, 191, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(45, 212, 191, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "translateY(0) scale(1)";
          }}
        >
          LAUNCH COMMAND CENTER
          <ArrowRight style={{ width: "22px", height: "22px" }} />
        </button>

        {/* Core Capabilities */}
        <div style={{ marginBottom: "1rem", color: "#94A3B8", fontSize: "0.95rem", fontWeight: "800", letterSpacing: "0.08em", textAlign: "left", width: "100%", maxWidth: "950px" }}>
          CORE CAPABILITIES
        </div>
        <div style={{
          display: "flex",
          gap: "1.5rem",
          maxWidth: "950px",
          width: "100%",
          marginBottom: "2.5rem"
        }}>
          {[
            { icon: <Map />, title: "Predictive Heatmaps (ML)", desc: "Anticipate incidents before they happen" },
            { icon: <Brain />, title: "Explainable AI (XAI)", desc: "Transparent allocation logic" },
            { icon: <Wrench />, title: "Manual Override", desc: "Human-in-the-loop controls" }
          ].map((item, idx) => (
            <div key={idx} style={{
              flex: 1,
              background: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(45, 212, 191, 0.3)",
              borderRadius: "16px",
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              backdropFilter: "blur(20px)",
              transition: "transform 0.3s, background 0.3s, box-shadow 0.3s",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              cursor: "default"
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(45, 212, 191, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "rgba(15, 23, 42, 0.4)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            >
              <div style={{ 
                background: "linear-gradient(135deg, #115E59 0%, #1E3A8A 100%)", 
                padding: "12px", 
                borderRadius: "12px",
                color: "#2DD4BF",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
              }}>
                {item.icon}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "800", fontSize: "1rem", color: "#F8FAFC" }}>{item.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px", fontWeight: "600" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div style={{ display: "flex", gap: "1.5rem", width: "100%", maxWidth: "950px" }}>
          {/* Quick Zone Status */}
          <div style={{ flex: 2, background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(45, 212, 191, 0.3)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(20px)", textAlign: "left", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}>
            <div style={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: "800", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>QUICK ZONE STATUS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(2, 6, 23, 0.5)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)" }}>
                <div>
                  <div style={{ fontWeight: "800", color: "#F8FAFC", fontSize: "1rem" }}>Sitabuldi</div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "600", marginTop: "2px" }}>Wardha Rd, Variety Sq</div>
                </div>
                <div style={{ background: "rgba(225, 29, 72, 0.2)", color: "#FDA4AF", padding: "0.25rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "800", alignSelf: "center", border: "1px solid rgba(225, 29, 72, 0.3)" }}>High</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(2, 6, 23, 0.5)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)" }}>
                <div>
                  <div style={{ fontWeight: "800", color: "#F8FAFC", fontSize: "1rem" }}>Sadar</div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "600", marginTop: "2px" }}>Residency Rd</div>
                </div>
                <div style={{ background: "rgba(5, 150, 105, 0.2)", color: "#6EE7B7", padding: "0.25rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "800", alignSelf: "center", border: "1px solid rgba(5, 150, 105, 0.3)" }}>Low</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(2, 6, 23, 0.5)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)" }}>
                <div>
                  <div style={{ fontWeight: "800", color: "#F8FAFC", fontSize: "1rem" }}>Wardha Avenue</div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: "600", marginTop: "2px" }}>Chatrapati Sq</div>
                </div>
                <div style={{ background: "rgba(217, 119, 6, 0.2)", color: "#FCD34D", padding: "0.25rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "800", alignSelf: "center", border: "1px solid rgba(217, 119, 6, 0.3)" }}>Medium</div>
              </div>
            </div>
          </div>
          
          {/* Recent System Updates */}
          <div style={{ flex: 1, background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(45, 212, 191, 0.3)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(20px)", textAlign: "left", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}>
            <div style={{ color: "#94A3B8", fontSize: "0.85rem", fontWeight: "800", letterSpacing: "0.08em", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              RECENT ALERTS
              <span style={{ cursor: "pointer", background: "rgba(2, 6, 23, 0.5)", padding: "2px 8px", borderRadius: "8px", fontSize: "16px" }}>×</span>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "rgba(2, 6, 23, 0.5)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ background: "linear-gradient(135deg, #115E59 0%, #1E3A8A 100%)", color: "#2DD4BF", padding: "0.6rem", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)" }}>
                <Users style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "#F8FAFC" }}>Officer Redeployed</div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "4px", lineHeight: "1.4", fontWeight: "500" }}>Sub-Inspector Amit Patil moved to Law College Sq due to new hazard report.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
