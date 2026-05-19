// ─────────────────────────────────────────────
// MenuPage — app menu with links to key sections
// Opened when the Menu button in the nav bar is pressed.
// "Account" leads to the user's profile page.
// Other items are placeholders for future features.
// ─────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import "./MenuPage.css";

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18l6-6-6-6"
        stroke="#1B4591"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const menuItems = [
  { id: "account", label: "Account" },
  { id: "tickets", label: "Buy tickets" },
  { id: "volunteer", label: "Become a volunteer" },
  { id: "faq", label: "FAQ" },
  { id: "founders", label: "Founders" },
];

export default function MenuPage({ onGroupClick }) {
  const [activeTab, setActiveTab] = useState("menu");
  const navigate = useNavigate();

  function handleItemPress(id) {
    if (id === "account") {
      navigate("/profile");
    }
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <span className="menu-header-title">MENU</span>
      </div>

      <main className="menu-main">
        <ul className="menu-list">
          {menuItems.map((item, i) => (
            <li key={item.id}>
              <button
                className="menu-item"
                onClick={() => handleItemPress(item.id)}
              >
                <span className="menu-item-label">{item.label}</span>
                <ArrowIcon />
              </button>

              {i < menuItems.length - 1 && <div className="menu-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar
        active={activeTab}
        onTabChange={setActiveTab}
        onGroupClick={onGroupClick}
      />
    </div>
  );
}