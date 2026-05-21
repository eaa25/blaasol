// Top header bar — appears on every page.
//
// Two variants:
//   "default" — shows ticket icon (left), logo (center), account icon (right)
//   "back"    — shows a back arrow (left), logo (center), nothing on the right
//
// The logo always navigates to "/". The account icon navigates to "/profile"
// and passes the current tab so the NavBar stays correctly highlighted there.
// onBackClick can be overridden; it defaults to navigate(-1).

import { useNavigate, useLocation } from "react-router-dom";

import logoImg    from "../assets/header/logo-light-blue.svg";
import ticketImg  from "../assets/header/ticket-icon.png";
import accountImg from "../assets/header/account-icon.png";
import backArrowImg from "../assets/header/backarrow.png";

import "./Header.css";

// Maps each route to the nav tab ID that should stay highlighted on ProfilePage
const pathToTab = {
  "/": "start", "/homepage": "start",
  "/schedule": "schedule",
  "/map": "map",
  "/groups": "group", "/group-schedule": "group",
  "/menu": "menu",
};

export default function Header({ variant = "default", onBackClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isBackHeader = variant === "back";

  function handleBackClick() {
    if (onBackClick) onBackClick();
    else navigate(-1);
  }

  return (
    <header className="app-header">
      <div className="header-left">
        {isBackHeader ? (
          <button className="header-btn" onClick={handleBackClick} aria-label="Go back">
            <img src={backArrowImg} alt="Back" className="header-back-icon" />
          </button>
        ) : (
          // Ticket icon — currently leads to the 404 placeholder page
          <button className="header-btn" onClick={() => navigate("/404")} aria-label="Tickets">
            <img src={ticketImg} alt="Tickets" className="header-icon" />
          </button>
        )}
      </div>

      {/* Logo — always navigates home */}
      <button className="header-logo-btn" onClick={() => navigate("/")} aria-label="Go to homepage">
        <img src={logoImg} alt="BLÅ SOL" className="header-logo" />
      </button>

      <div className="header-right">
        {!isBackHeader && (
          <button
            className="header-btn"
            onClick={() => navigate("/profile", { state: { activeTab: pathToTab[location.pathname] ?? "start" } })}
            aria-label="Go to profile"
          >
            <img src={accountImg} alt="Profile" className="header-icon" />
          </button>
        )}
      </div>
    </header>
  );
}
