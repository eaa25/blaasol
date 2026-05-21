// Another person's profile page — opened by tapping a friend in your profile
// list or a member inside a group.
// Shows their name, friend count, their friends list, and a friendship button.
//
// Friendship button states:
//   "friends"     → dark button with chevron → opens a bottom sheet
//   "not friends" → outlined "add friend" button
//
// Bottom sheet options: REMOVE FRIEND (with confirmation) or SEE LOCATION.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import img1 from "../assets/emma.png";
import img2 from "../assets/sofie.png";
import img3 from "../assets/andreas.png";
import img4 from "../assets/frederik.png";
import img5 from "../assets/cecilie.jpeg";

import "./FriendProfilePage.css";
import "./GroupDetailPage.css";

// SVG icon components used in the friendship button and bottom sheet

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Silhouette — used inside the "friends" status button
function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Person with × — used in the "Remove Friend" action button
function RemoveFriendIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="7" r="4" stroke="white" strokeWidth="2" />
      <path d="M2 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 14l4 4M21 14l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Person with map pin — used in the "See Location" action button
function LocationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="7" r="4" stroke="white" strokeWidth="2" />
      <path d="M2 20c0-4 3.6-7 8-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 13c-2.2 0-4 1.8-4 4 0 2.5 4 6 4 6s4-3.5 4-6c0-2.2-1.8-4-4-4z" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="18" cy="17" r="1.2" fill="white" />
    </svg>
  );
}

export default function FriendProfilePage({ friend, onBack }) {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("friends"); // "friends" or "artists" tab
  const [isFriend, setIsFriend]           = useState(true);      // current friendship status
  const [showPopup, setShowPopup]         = useState(false);     // bottom sheet open
  const [showConfirm, setShowConfirm]     = useState(false);     // remove-friend confirmation open

  // Hardcoded friends list shown on this person's profile
  const friendsList = [
    { id: 1, name: "Emma Sørensen",     avatar: img1 },
    { id: 2, name: "Sofie Christensen", avatar: img2 },
    { id: 3, name: "Andreas Nielsen",   avatar: img3 },
    { id: 4, name: "Frederik Larsen",   avatar: img4 },
    { id: 5, name: "Cecilie Winther",   avatar: img5 },
  ];

  // Confirms unfriending after the warning popup
  function handleRemoveFriend() {
    setIsFriend(false);
    setShowConfirm(false);
  }

  return (
    <div className="friend-page">
      <Header variant="back" onBackClick={onBack} />

      <main className="friend-main">
        {/* Top section: avatar, name, friend count, friendship button */}
        <div className="friend-top">
          <div className="friend-avatar-wrap">
            {friend.avatar
              ? <img src={friend.avatar} alt={friend.name} className="friend-profile-avatar" />
              : <div className="friend-avatar-placeholder" />}
          </div>

          <div className="friend-info">
            <h1 className="friend-profile-name">{friend.name.toUpperCase()}</h1>
            <p className="friend-count">7 friends</p>

            {isFriend ? (
              // Already friends — tap to open the bottom sheet
              <button className="friend-status-btn" onClick={() => setShowPopup(true)}>
                <PersonIcon />
                friends
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            ) : (
              // Not friends — tap to re-add them
              <button className="friend-add-btn" onClick={() => setIsFriend(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="#1B4591" strokeWidth="2" />
                  <path d="M2 20c0-4 3.6-7 8-7s6 2 7 5" stroke="#1B4591" strokeWidth="2" strokeLinecap="round" />
                  <path d="M19 12v6M16 15h6" stroke="#1B4591" strokeWidth="2" strokeLinecap="round" />
                </svg>
                add friend
              </button>
            )}
          </div>
        </div>

        {/* Friends / Artists tab switcher */}
        <div className="friend-tabs">
          <button
            className={`friend-tab ${activeSection === "friends" ? "active" : ""}`}
            onClick={() => setActiveSection("friends")}
          >
            Friends
          </button>
          <span className="friend-tab-divider">|</span>
          <button
            className={`friend-tab ${activeSection === "artists" ? "active" : ""}`}
            onClick={() => setActiveSection("artists")}
          >
            Artists
          </button>
        </div>

        {/* Friends tab — non-clickable for now (placeholder) */}
        {activeSection === "friends" && (
          <ul className="friend-list">
            {friendsList.map((f, i) => (
              <li key={f.id} className="friend-list-item">
                <div className="friend-list-avatar">
                  {f.avatar
                    ? <img src={f.avatar} alt={f.name} />
                    : <div className="friend-list-placeholder" />}
                </div>
                <span className="friend-list-name">{f.name}</span>
                <ArrowIcon />
                {i < friendsList.length - 1 && <div className="friend-list-divider" />}
              </li>
            ))}
          </ul>
        )}

        {/* Artists tab — placeholder until their liked acts are available */}
        {activeSection === "artists" && (
          <p className="friend-empty">No artists saved yet.</p>
        )}
      </main>

      <NavBar active="group" />

      {/* Remove-friend confirmation popup (warning triangle) */}
      {showConfirm && (
        <div className="leave-overlay" onClick={() => setShowConfirm(false)}>
          <div className="leave-card" onClick={(e) => e.stopPropagation()}>
            <svg width="64" height="58" viewBox="0 0 64 58" fill="none">
              <path d="M32 4L60 54H4L32 4Z" fill="#FFD043" stroke="#1B4591" strokeWidth="3" strokeLinejoin="round" />
              <text x="32" y="44" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#1B4591">!</text>
            </svg>
            <p className="leave-text">Are you sure you want to remove this friend?</p>
            <div className="leave-btns">
              <button className="leave-btn-back"    onClick={() => setShowConfirm(false)}>BACK</button>
              <button className="leave-btn-confirm" onClick={handleRemoveFriend}>REMOVE</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom sheet — shown when tapping the "friends" button */}
      {showPopup && (
        <div className="unfriend-overlay" onClick={() => setShowPopup(false)}>
          <div className="unfriend-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="unfriend-header">
              {/* Shows only first name, e.g. "LAURA" */}
              <span className="unfriend-name">{friend.name.split(" ")[0].toUpperCase()}</span>
              <button className="unfriend-close" onClick={() => setShowPopup(false)}>✕</button>
            </div>

            <button
              className="unfriend-action-btn"
              onClick={() => { setShowPopup(false); setShowConfirm(true); }}
            >
              <span>REMOVE FRIEND</span>
              <RemoveFriendIcon />
            </button>

            {/* Navigates to the map page and auto-opens this friend's detail */}
            <button
              className="unfriend-action-btn"
              onClick={() => { setShowPopup(false); navigate("/map", { state: { openFriendName: friend.name } }); }}
            >
              <span>SEE LOCATION</span>
              <LocationIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
