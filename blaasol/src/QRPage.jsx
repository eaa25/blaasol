import { useState } from "react";
import { QRCode } from "react-qr-code";
import Header from "./Header";
import NavBar from "./NavBar";
import "./QRPage.css";

const INVITE_CODE = "BB345";

function CopyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function QRPage({ group, onBack }) {
  const [activeTab, setActiveTab] = useState("group");
  const [copied, setCopied]       = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INVITE_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="qr-page">
      <Header showBack onBackClick={onBack} />

      <main className="qr-main">
        <p className="qr-description">
          Show this QR code or share the invite code with your friends so they
          can join your group and stay connected during the festival.
        </p>

        <div className="qr-blob-wrap">
          <svg className="qr-blob-svg" viewBox="0 0 300 275" xmlns="http://www.w3.org/2000/svg">
            <path
              className="qr-blob-path"
              d="
                M 8,52
                L 5,28
                L 32,6
                L 75,1
                L 128,7
                L 182,2
                L 230,6
                L 258,2
                L 296,36
                L 299,88
                L 292,140
                L 298,192
                L 295,242
                L 262,272
                L 212,267
                L 165,273
                L 118,267
                L 68,272
                L 30,272
                L 3,246
                L 6,196
                L 2,144
                L 7,96
                Z
              "
            />
          </svg>
          <div className="qr-card">
            <QRCode
              value={`blaasol-group-${INVITE_CODE}`}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        <div className="qr-code-row">
          <span className="qr-invite-code">{INVITE_CODE}</span>
          <button className="qr-copy-btn" onClick={handleCopy} aria-label="Copy invite code">
            {copied ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <CopyIcon />
            )}
          </button>
        </div>
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
