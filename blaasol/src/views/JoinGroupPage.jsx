// Join Group page — opened from the "+" popup on GroupsPage.
// Lets the user scan a QR code with the camera or type an invite code manually.
// Calls onJoin(code) — returns true on success, false on a wrong code.

import { useState, useEffect, useRef } from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import "./JoinGroupPage.css";

export default function JoinGroupPage({ onBack, onJoin }) {
  const [code,     setCode]     = useState("");    // typed invite code
  const [camError, setCamError] = useState(false); // true if camera access was denied
  const [error,    setError]    = useState(false); // true if the entered code was wrong

  const videoRef = useRef(null);

  // Try to open the rear camera for QR scanning; silently fall back if unavailable
  useEffect(() => {
    let stream;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCamError(true));

    // Stop all tracks when the component unmounts to release the camera
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  function handleJoin() {
    const ok = onJoin(code);
    if (!ok) setError(true);
  }

  return (
    <div className="join-page">
      <Header variant="back" onBackClick={onBack} />

      <main className="join-main">
        <h1 className="join-title">JOIN A GROUP</h1>

        {/* Camera preview for QR scanning */}
        <div className="join-camera-box">
          {camError ? (
            <p className="join-cam-error">Camera not available</p>
          ) : (
            <video ref={videoRef} className="join-video" autoPlay playsInline muted />
          )}
        </div>

        <p className="join-scan-label">Scan a QR code</p>
        <p className="join-or">or</p>
        <p className="join-manual-label">Enter the code manually</p>

        {/* Manual invite code input — Enter key also submits */}
        <input
          className="join-code-input"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
          placeholder="xxxxxxx"
          maxLength={10}
        />

        {error && <p className="join-error">Wrong code. Please try again.</p>}

        <button className="join-submit-btn" onClick={handleJoin}>JOIN</button>
      </main>

      <NavBar active="group" />
    </div>
  );
}
