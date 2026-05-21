// Bottom navigation bar — appears on every main page.
// Highlights the active tab either by matching the current URL path or by the
// explicit "active" prop (used on pages whose path doesn't match a tab, e.g.
// /group-schedule uses active="schedule", /profile uses the tab from route state).

import { useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";

import navBg from "../assets/navbar/navbar-pink-bg.png";

import startImg          from "../assets/navbar/start.png";
import startActiveImg    from "../assets/navbar/start-active.png";
import scheduleImg       from "../assets/navbar/schedule.png";
import scheduleActiveImg from "../assets/navbar/schedule-active.png";
import mapImg            from "../assets/navbar/map.png";
import mapActiveImg      from "../assets/navbar/map-active.png";
import groupImg          from "../assets/navbar/group.png";
import groupActiveImg    from "../assets/navbar/group-active.png";
import menuImg           from "../assets/navbar/menu.png";
import menuActiveImg     from "../assets/navbar/menu-active.png";

const tabs = [
  { id: "start",    label: "Start",    path: "/",        inactive: startImg,    active: startActiveImg    },
  { id: "schedule", label: "Schedule", path: "/schedule", inactive: scheduleImg, active: scheduleActiveImg },
  { id: "map",      label: "Map",      path: "/map",      inactive: mapImg,      active: mapActiveImg      },
  { id: "group",    label: "Group",    path: "/groups",   inactive: groupImg,    active: groupActiveImg    },
  { id: "menu",     label: "Menu",     path: "/menu",     inactive: menuImg,     active: menuActiveImg     },
];

export default function NavBar({ active }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav" style={{ backgroundImage: `url(${navBg})` }}>
      <div className="nav-items">
        {tabs.map((tab) => {
          // Use the explicit prop if given, otherwise infer from the current URL
          const isActive = active
            ? active === tab.id
            : location.pathname === tab.path;

          return (
            <button key={tab.id} className="nav-item" onClick={() => navigate(tab.path)}>
              <img
                src={isActive ? tab.active : tab.inactive}
                alt={tab.label}
                className="nav-icon"
              />
              <span className={isActive ? "active-text" : ""}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
