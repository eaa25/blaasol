import React, { useState } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import img1 from "./assets/anastasia.png";
import img2 from "./assets/selvglad.png";
import img3 from "./assets/bonad.png";
import img4 from "./assets/specktors.png";
import img5 from "./assets/gnags.png";
import img6 from "./assets/zarpaulo.png";
import "./GroupsPage.css";

const groups = [
  { id: 1, name: "Bass & Besties", avatar: img1 },
  { id: 2, name: "Blue Crew", avatar: img2 },
  { id: 3, name: "Last Ones Standing", avatar: img3 },
  { id: 4, name: "Blå Buddies", avatar: img4 },
  { id: 5, name: "Mic Check Crew", avatar: img5 },
  { id: 6, name: "Beer Pressure", avatar: img6 },
  { id: 7, name: "Sunburn Society", avatar: img6 },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("group");
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="groups-page">
      <Header onTicketsClick={() => {}} onProfileClick={() => {}} />

      <main className="groups-main">
        <div className="groups-heading">
          <h1 className="groups-title">YOUR GROUPS</h1>
          <button className="add-btn" aria-label="Add group" onClick={() => setShowPopup(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <ul className="groups-list">
          {groups.map((group, i) => (
            <li key={group.id} className="group-item">
              <img src={group.avatar} alt={group.name} className="group-avatar" />
              <span className="group-name">{group.name}</span>
              {i < groups.length - 1 && <div className="group-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} />

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
            <button className="popup-btn">CREATE A NEW GROUP</button>
            <button className="popup-btn">JOIN AN EXISTING GROUP</button>
          </div>
        </div>
      )}
    </div>
  );
}
