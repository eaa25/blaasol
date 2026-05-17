import React from "react";

import sunImg from "../assets/sun.png";
import ticketImg from "../assets/ticket.png";
import accountImg from "../assets/accounticon.png";
import backArrowImg from "../assets/backarrow.png";

import "./Header.css";

export default function Header({ onTicketsClick, onProfileClick, showBack, onBackClick }) {
  return (
    <header className="app-header">
      {showBack ? (
        <button className="header-btn-img" onClick={onBackClick} aria-label="Back">
          <img src={backArrowImg} alt="Back" className="header-back-arrow" />
        </button>
      ) : (
        <button className="header-btn-img" onClick={onTicketsClick} aria-label="Tickets">
          <img src={ticketImg} alt="Tickets" className="header-ticket" />
        </button>
      )}

      <div className="header-center">
        <img src={sunImg} alt="Sun" className="header-sun" />
        <div className="header-text">
          <span className="header-title">BLÅ SOL</span>
          <span className="header-sub">6. JUNI 2026</span>
        </div>
      </div>

      {showBack ? (
        <div style={{ width: 70 }} />
      ) : (
        <button className="header-btn-img" onClick={onProfileClick} aria-label="Profile">
          <img src={accountImg} alt="Account" className="header-ticket" />
        </button>
      )}
    </header>
  );
}
