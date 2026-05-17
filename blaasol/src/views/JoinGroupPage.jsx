import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import "./JoinGroupPage.css";

export default function JoinGroupPage({ onBack, onJoin }) {
  const [activeTab, setActiveTab] = useState("group");
  const [code, setCode] = useState("");
  const [camError, setCamError] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => setCamError(true));

    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="join-page">
      <Header showBack onBackClick={onBack} />

      <main className="join-main">
        <h1 className="join-title">JOIN A GROUP</h1>

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

        <input
          className="join-code-input"
          value={code}
          onChange={e => { setCode(e.target.value); setError(false); }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              const ok = onJoin(code);
              if (!ok) setError(true);
            }
          }}
          placeholder="xxxxxxx"
          maxLength={10}
        />
        {error && <p className="join-error">Wrong code. Please try again.</p>}
        <button
          className="join-submit-btn"
          onClick={() => {
            const ok = onJoin(code);
            if (!ok) setError(true);
          }}
        >
          JOIN
        </button>
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} onGroupClick={onBack} />
    </div>
  );
}
