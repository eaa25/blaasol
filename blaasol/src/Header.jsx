import React from "react";
import sunImg from "./assets/sun.png";
import ticketImg from "./assets/ticket.png";
import accountImg from "./assets/accounticon.png";
import "./Header.css";

export default function Header({ onTicketsClick, onProfileClick }) {
  return (
    <header className="app-header">
      <button className="header-btn-img" onClick={onTicketsClick} aria-label="Tickets">
        <img src={ticketImg} alt="Tickets" className="header-ticket" />
      </button>

      <div className="header-center">
        <img src={sunImg} alt="Sun" className="header-sun" />
        <div className="header-text">
          <span className="header-title">BLÅ SOL</span>
          <span className="header-sub">6. JUNI 2026</span>
        </div>
      </div>

      <button className="header-btn-img" onClick={onProfileClick} aria-label="Profile">
        <img src={accountImg} alt="Account" className="header-ticket" />
      </button>
    </header>
  );
}
