import { useNavigate } from "react-router-dom";

import logoImg from "../assets/header/logo-light-blue.svg";
import ticketImg from "../assets/header/ticket-icon.png";
import accountImg from "../assets/header/account-icon.png";
import backArrowImg from "../assets/header/backarrow.png";

import "./Header.css";

export default function Header({ variant = "default", onBackClick }) {
  const navigate = useNavigate();

  const isBackHeader = variant === "back";

  function handleBackClick() {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  }

  return (
    <header className="app-header">
      <div className="header-left">
        {isBackHeader ? (
          <button
            className="header-btn"
            onClick={handleBackClick}
            aria-label="Go back"
          >
            <img src={backArrowImg} alt="Back" className="header-back-icon" />
          </button>
        ) : (
          <button className="header-btn header-ticket-btn" aria-label="Tickets">
            <img src={ticketImg} alt="Tickets" className="header-icon" />
          </button>
        )}
      </div>

      <button
        className="header-logo-btn"
        onClick={() => navigate("/")}
        aria-label="Go to homepage"
      >
        <img src={logoImg} alt="BLÅ SOL" className="header-logo" />
      </button>

      <div className="header-right">
        {!isBackHeader && (
          <button
            className="header-btn"
            onClick={() => navigate("/profile")}
            aria-label="Go to profile"
          >
            <img src={accountImg} alt="Profile" className="header-icon" />
          </button>
        )}
      </div>
    </header>
  );
}