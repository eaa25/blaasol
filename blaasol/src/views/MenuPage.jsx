// App menu page — reachable via the Menu tab in the bottom nav.
// Lists site-wide links. "Account" navigates to the user's profile.
// Other items are placeholders for future features.

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
  { id: "account",   label: "Account"            },
  { id: "tickets",   label: "Buy tickets"         },
  { id: "volunteer", label: "Become a volunteer"  },
  { id: "faq",       label: "FAQ"                 },
  { id: "founders",  label: "Founders"            },
];

export default function MenuPage() {
  const navigate = useNavigate();

  function handleItemPress(id) {
    if (id === "account") {
      // Pass the current tab so the NavBar stays highlighted correctly on ProfilePage
      navigate("/profile", { state: { activeTab: "menu" } });
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
              <button className="menu-item" onClick={() => handleItemPress(item.id)}>
                <span className="menu-item-label">{item.label}</span>
                <ArrowIcon />
              </button>
              {i < menuItems.length - 1 && <div className="menu-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar active="menu" />
    </div>
  );
}
