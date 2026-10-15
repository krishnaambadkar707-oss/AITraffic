import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, MapPin, CheckCircle, ArrowRight, ShieldAlert, Car, AlertOctagon, ParkingSquare, Sparkles, RefreshCw, ShieldCheck, X, VideoIcon } from "lucide-react";
import { TRANSLATIONS } from "../common/LanguageSelector";

// ─── Web Audio Sound Engine ───────────────────────────────────────────────────
function useSounds() {
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };

  // Short beep — used for countdown ticks
  const playBeep = useCallback((freq = 880, duration = 0.12, vol = 0.3) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }, []);

  // Camera shutter — mechanical click feel
  const playShutter = useCallback(() => {
    try {
      const ctx = getCtx();
      // Click transient via noise burst
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 3000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }, []);

  // Success chime — ascending 3-note ding
  const playSuccess = useCallback(() => {
    try {
      const ctx = getCtx();
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const start = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.4, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (_) {}
  }, []);

  return { playBeep, playShutter, playSuccess };
}

// ─── Live Camera Capture Component ───────────────────────────────────────────
function LiveCameraCapture({ onPhotoCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // rear camera by default
  const { playBeep, playShutter } = useSounds();

  const startCamera = useCallback(async (mode) => {
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsReady(false);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setIsReady(true);
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permission and try again.");
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, startCamera]);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const capturePhoto = () => {
    // Countdown 3-2-1 then capture
    let count = 3;
    setCountdown(count);
    playBeep(880, 0.12, 0.3); // first beep immediately
    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        doCapture();
      } else {
        // Each countdown tick: beep slightly higher pitch
        playBeep(count === 1 ? 1200 : 1000, 0.12, 0.3);
        setCountdown(count);
      }
    }, 1000);
  };

  const doCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const W = video.videoWidth || 640;
    const H = video.videoHeight || 480;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    // Draw the video frame
    ctx.drawImage(video, 0, 0, W, H);

    // ── Watermark: timestamp + "LIVE CAPTURED" badge ──
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Semi-transparent bottom bar
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, H - 52, W, 52);

    // "🔴 LIVE CAPTURED" badge top-left
    ctx.fillStyle = "rgba(220,38,38,0.9)";
    ctx.roundRect(10, H - 46, 140, 24, 4);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 11px Arial";
    ctx.fillText("🔴  LIVE CAPTURED", 16, H - 29);

    // Timestamp top-right area
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`📅 ${dateStr}  🕐 ${timeStr}`, W - 10, H - 30);

    // Anti-spam line
    ctx.font = "10px Arial";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("Nagpur Traffic AI • Anti-Spam Verified", W - 10, H - 12);

    ctx.textAlign = "left";

    // Stop stream after capture
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());

    playShutter(); // 📸 camera shutter click sound

    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    onPhotoCapture(dataUrl, { timestamp: now.toISOString() });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000",
      display: "flex", flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.75rem 1rem",
        background: "rgba(0,0,0,0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#EF4444",
            animation: "pulse 1.2s ease-in-out infinite"
          }} />
          <span style={{ color: "#FFF", fontWeight: "700", fontSize: "0.9rem" }}>
            LIVE CAMERA — Anti-Spam Mode
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={flipCamera} style={{
            background: "rgba(255,255,255,0.15)", border: "none",
            borderRadius: "50%", width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#FFF"
          }}>
            <RefreshCw style={{ width: "18px", height: "18px" }} />
          </button>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.15)", border: "none",
            borderRadius: "50%", width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#FFF"
          }}>
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: "rgba(37,99,235,0.85)", padding: "0.4rem 1rem",
        fontSize: "0.75rem", color: "#DBEAFE", textAlign: "center", fontWeight: "600"
      }}>
        📷 Only live photo allowed — Gallery upload disabled to prevent fake reports
      </div>

      {/* Camera View */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {error ? (
          <div style={{
            height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem"
          }}>
            <VideoIcon style={{ width: "48px", height: "48px", color: "#EF4444" }} />
            <p style={{ color: "#FCA5A5", textAlign: "center", fontSize: "0.9rem" }}>{error}</p>
            <button onClick={() => startCamera(facingMode)} style={{
              background: "#2563EB", color: "#FFF", border: "none",
              borderRadius: "0.5rem", padding: "0.6rem 1.5rem",
              fontWeight: "700", cursor: "pointer"
            }}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Countdown Overlay */}
            {countdown !== null && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.4)"
              }}>
                <span style={{
                  fontSize: "8rem", fontWeight: "900", color: "#FFF",
                  textShadow: "0 0 40px rgba(255,255,255,0.5)",
                  animation: "scaleIn 0.9s ease"
                }}>
                  {countdown}
                </span>
              </div>
            )}
            {/* Live indicator corner */}
            {isReady && countdown === null && (
              <div style={{
                position: "absolute", top: "12px", left: "12px",
                background: "rgba(220,38,38,0.85)",
                color: "#FFF", fontSize: "0.7rem", fontWeight: "700",
                padding: "0.25rem 0.6rem", borderRadius: "999px",
                display: "flex", alignItems: "center", gap: "0.35rem"
              }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#FFF", display: "inline-block",
                  animation: "pulse 1s infinite"
                }} />
                LIVE
              </div>
            )}
          </>
        )}
      </div>

      {/* Capture Button */}
      <div style={{
        padding: "1.5rem",
        background: "rgba(0,0,0,0.8)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem"
      }}>
        <button
          onClick={capturePhoto}
          disabled={!isReady || countdown !== null || !!error}
          style={{
            width: "72px", height: "72px", borderRadius: "50%",
            border: "4px solid #FFF",
            background: isReady && !countdown && !error ? "#EF4444" : "#475569",
            cursor: isReady && !countdown && !error ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.15s ease, background 0.2s ease",
            boxShadow: "0 0 0 8px rgba(255,255,255,0.15)"
          }}
        >
          <Camera style={{ width: "28px", height: "28px", color: "#FFF" }} />
        </button>
        <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>
          {!isReady ? "Starting camera..." : countdown ? `Capturing in ${countdown}...` : "Tap to capture live photo"}
        </span>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes scaleIn { 0% { transform: scale(1.4); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── Main Complaint Form ──────────────────────────────────────────────────────
export default function ComplaintForm({ junctions, currentLang, onSubmitComplaint, onCancel, initialExtractedData = null }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const [category, setCategory] = useState(initialExtractedData?.category || "JAM");
  const [selectedJunctionId, setSelectedJunctionId] = useState(initialExtractedData?.junctionId || junctions[0]?.id || "j1");
  const [description, setDescription] = useState(initialExtractedData?.description || "");
  const [voterName, setVoterName] = useState(initialExtractedData?.citizenName || "");
  const [livePhotoData, setLivePhotoData] = useState(null);       // base64 dataURL
  const [livePhotoMeta, setLivePhotoMeta] = useState(null);       // { timestamp }
  const [showCamera, setShowCamera] = useState(false);
  const [submittedTrackingId, setSubmittedTrackingId] = useState(null);
  const { playSuccess } = useSounds();

  useEffect(() => {
    if (initialExtractedData) {
      if (initialExtractedData.category) setCategory(initialExtractedData.category);
      if (initialExtractedData.junctionId) setSelectedJunctionId(initialExtractedData.junctionId);
      if (initialExtractedData.description) setDescription(initialExtractedData.description);
      if (initialExtractedData.citizenName) setVoterName(initialExtractedData.citizenName);
    }
  }, [initialExtractedData]);

  const categories = [
    { id: "JAM", label: t.categoryJam, icon: Car, color: "#F59E0B" },
    { id: "ACCIDENT_HAZARD", label: t.categoryAccident, icon: AlertOctagon, color: "#EF4444" },
    { id: "RASH_DRIVING", label: t.categoryRash, icon: ShieldAlert, color: "#EC4899" },
    { id: "ILLEGAL_PARKING", label: t.categoryParking, icon: ParkingSquare, color: "#3B82F6" }
  ];

  const handlePhotoCapture = (dataUrl, meta) => {
    setLivePhotoData(dataUrl);
    setLivePhotoMeta(meta);
    setShowCamera(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!livePhotoData) return; // should not reach here due to disabled button

    const selectedJunction = junctions.find((j) => j.id === selectedJunctionId);
    const trackingId = `NGP-TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = {
      id: trackingId,
      junctionId: selectedJunctionId,
      junctionName: selectedJunction?.name || "Nagpur Junction",
      citizenName: voterName || "Nagpur Citizen",
      category,
      categoryLabel: categories.find((c) => c.id === category)?.label || "Traffic Issue",
      description: description || "Reported traffic issue at junction.",
      photoUrl: livePhotoData,
      photoMeta: livePhotoMeta,
      isLiveCaptured: true,
      timestamp: livePhotoMeta?.timestamp || new Date().toISOString(),
      status: "RECEIVED",
      assignedOfficerId: null,
      assignedOfficerName: null,
      upvotes: 1,
      policeNote: "Complaint logged with LIVE captured photo — anti-spam verified."
    };

    onSubmitComplaint(newComplaint);
    playSuccess(); // ✅ ascending chime on successful submission
    setSubmittedTrackingId(trackingId);
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submittedTrackingId) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <div style={{
          width: "60px", height: "60px", borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.15)", border: "2px solid #10B981",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1rem auto"
        }}>
          <CheckCircle style={{ width: "32px", height: "32px", color: "#10B981" }} />
        </div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0F172A", marginBottom: "0.25rem" }}>
          Complaint Submitted Successfully!
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1rem" }}>
          Your report has been logged and sent to Nagpur Traffic Police Control Room.
        </p>

        {/* Live Photo badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          background: "rgba(16,185,129,0.1)", border: "1px solid #10B981",
          borderRadius: "999px", padding: "0.3rem 0.75rem",
          fontSize: "0.75rem", fontWeight: "700", color: "#065F46",
          marginBottom: "1.25rem"
        }}>
          <ShieldCheck style={{ width: "14px", height: "14px", color: "#10B981" }} />
          Live Photo Verified — Anti-Spam ✓
        </div>

        <div style={{
          background: "#F1F5F9", border: "1px solid #CBD5E1",
          borderRadius: "0.5rem", padding: "1rem", marginBottom: "1.5rem"
        }}>
          <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: "600", display: "block" }}>
            YOUR COMPLAINT TRACKING ID
          </span>
          <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#1E40AF", fontFamily: "var(--font-mono)" }}>
            {submittedTrackingId}
          </span>
        </div>

        <button onClick={onCancel} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Back to Citizen Home
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Camera Modal */}
      {showCamera && (
        <LiveCameraCapture
          onPhotoCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", padding: "1rem" }}>
        {/* AI Extraction Banner */}
        {initialExtractedData && (
          <div style={{
            background: "rgba(37, 99, 235, 0.1)", border: "1px solid #3B82F6",
            color: "#1E40AF", fontSize: "0.75rem", fontWeight: "700",
            padding: "0.4rem 0.6rem", borderRadius: "0.4rem",
            display: "flex", alignItems: "center", gap: "0.3rem"
          }}>
            <Sparkles style={{ width: "14px", height: "14px", color: "#2563EB" }} />
            Form pre-filled automatically by Citizen AI Assistant!
          </div>
        )}

        {/* Category Picker */}
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.5rem" }}>
            {t.selectCategory}
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
                    border: isSelected ? `2px solid ${cat.color}` : "1px solid #CBD5E1",
                    background: isSelected ? `${cat.color}15` : "#FFFFFF",
                    color: isSelected ? "#0F172A" : "#475569",
                    fontWeight: isSelected ? "700" : "500",
                    fontSize: "0.8rem", cursor: "pointer", textAlign: "left"
                  }}
                >
                  <Icon style={{ width: "18px", height: "18px", color: cat.color }} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Picker */}
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.4rem" }}>
            {t.selectLocation}
          </label>
          <select
            value={selectedJunctionId}
            onChange={(e) => setSelectedJunctionId(e.target.value)}
            style={{
              width: "100%", padding: "0.65rem 0.75rem",
              borderRadius: "0.5rem", border: "1px solid #CBD5E1",
              background: "#FFFFFF", color: "#0F172A", fontSize: "0.85rem"
            }}
          >
            {junctions.map((j) => (
              <option key={j.id} value={j.id}>
                📍 {j.name} ({j.zone}) - {j.landmark}
              </option>
            ))}
          </select>
        </div>

        {/* Description & Citizen Name */}
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.4rem" }}>
            {t.addDetails}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the obstruction or hazard (e.g., bus parked blocking lane)..."
            required
            style={{
              width: "100%", padding: "0.65rem 0.75rem",
              borderRadius: "0.5rem", border: "1px solid #CBD5E1",
              background: "#FFFFFF", color: "#0F172A", fontSize: "0.85rem",
              fontFamily: "var(--font-primary)", marginBottom: "0.6rem"
            }}
          />
          <input
            type="text"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            placeholder="Your Name (Optional)"
            style={{
              width: "100%", padding: "0.6rem 0.75rem",
              borderRadius: "0.5rem", border: "1px solid #CBD5E1",
              background: "#FFFFFF", color: "#0F172A", fontSize: "0.85rem"
            }}
          />
        </div>

        {/* ── LIVE PHOTO SECTION ─────────────────────────────────────────────── */}
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A", display: "block", marginBottom: "0.4rem" }}>
            {t.photoLabel}
            <span style={{
              marginLeft: "0.5rem", fontSize: "0.7rem", fontWeight: "600",
              color: "#DC2626", background: "#FEE2E2",
              padding: "0.1rem 0.4rem", borderRadius: "999px"
            }}>
              LIVE ONLY
            </span>
          </label>

          {livePhotoData ? (
            /* ── Photo Preview after capture ── */
            <div style={{ position: "relative", borderRadius: "0.75rem", overflow: "hidden", border: "2px solid #10B981" }}>
              <img
                src={livePhotoData}
                alt="Live captured evidence"
                style={{ width: "100%", maxHeight: "180px", objectFit: "cover", display: "block" }}
              />
              {/* Verified Badge */}
              <div style={{
                position: "absolute", top: "8px", left: "8px",
                background: "rgba(16,185,129,0.9)", color: "#FFF",
                fontSize: "0.68rem", fontWeight: "700",
                padding: "0.2rem 0.5rem", borderRadius: "999px",
                display: "flex", alignItems: "center", gap: "0.3rem"
              }}>
                <ShieldCheck style={{ width: "11px", height: "11px" }} />
                Live Verified
              </div>
              {/* Retake button */}
              <button
                type="button"
                onClick={() => { setLivePhotoData(null); setLivePhotoMeta(null); }}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  background: "rgba(0,0,0,0.6)", color: "#FFF", border: "none",
                  borderRadius: "999px", padding: "0.25rem 0.6rem",
                  fontSize: "0.7rem", fontWeight: "700", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.3rem"
                }}
              >
                <RefreshCw style={{ width: "11px", height: "11px" }} />
                Retake
              </button>
            </div>
          ) : (
            /* ── Camera Launch Button ── */
            <div>
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                style={{
                  width: "100%", height: "120px",
                  borderRadius: "0.75rem",
                  border: "2px dashed #3B82F6",
                  background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "0.5rem", cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #DBEAFE 0%, #E0F2FE 100%)";
                  e.currentTarget.style.borderColor = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)";
                  e.currentTarget.style.borderColor = "#3B82F6";
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: "#2563EB", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <Camera style={{ width: "22px", height: "22px", color: "#FFF" }} />
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1E40AF" }}>
                  Tap to Open Live Camera
                </span>
                <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                  Gallery disabled • Only live capture allowed
                </span>
              </button>

              {/* Anti-spam notice */}
              <div style={{
                marginTop: "0.5rem",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
                display: "flex", alignItems: "flex-start", gap: "0.5rem"
              }}>
                <ShieldCheck style={{ width: "14px", height: "14px", color: "#DC2626", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ fontSize: "0.7rem", color: "#7F1D1D", margin: 0, lineHeight: 1.5 }}>
                  <strong>Anti-Spam Protection:</strong> Only real-time camera photos are accepted.
                  Pre-existing gallery photos cannot be used to prevent false/fake reports.
                  The photo will be auto-stamped with date & time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: "center", background: "#E2E8F0", color: "#334155" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!livePhotoData}
            style={{
              flex: 2, justifyContent: "center",
              opacity: livePhotoData ? 1 : 0.45,
              cursor: livePhotoData ? "pointer" : "not-allowed"
            }}
          >
            {!livePhotoData ? "📷 Live Photo Required" : t.submitBtn}
            {livePhotoData && <ArrowRight style={{ width: "16px", height: "16px" }} />}
          </button>
        </div>
      </form>
    </>
  );
}
