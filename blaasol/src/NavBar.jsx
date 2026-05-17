import "./NavBar.css";
import startImg from "./assets/start button.png";
import scheduleImg from "./assets/schedule button.png";
import mapImg from "./assets/map button.png";
import groupImg from "./assets/group button.png";
import menuImg from "./assets/menu button.png";

const tabs = [
  { id: "start",    label: "Start",    img: startImg },
  { id: "schedule", label: "Schedule", img: scheduleImg },
  { id: "map",      label: "Map",      img: mapImg },
  { id: "group",    label: "Group",    img: groupImg },
  { id: "menu",     label: "Menu",     img: menuImg },
];

export default function NavBar({ active = "group", onTabChange, onGroupClick, onMenuClick }) {
  return (
    <nav className="bottom-nav">
      <div className="nav-wave">
        <svg viewBox="0 0 390 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L390,0 L390,18 Q293,36 195,18 Q98,0 0,18 Z" fill="#E5F0F3"/>
        </svg>
      </div>
      <div className="nav-items">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item${active === tab.id ? " active" : ""}`}
            onClick={() => {
              if (tab.id === "group" && onGroupClick) {
                onGroupClick();
              } else if (tab.id === "menu" && onMenuClick) {
                onMenuClick();
              } else {
                onTabChange?.(tab.id);
              }
            }}
            aria-label={tab.label}
          >
            <img
              src={tab.img}
              alt={tab.label}
              className="nav-icon"
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
