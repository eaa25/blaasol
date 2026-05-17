// ─────────────────────────────────────────────
// FriendProfilePage — another person's profile
// Opened when you tap a friend in your profile list or a member in a group.
// Shows their name, friend count, friends list, and a friendship button.
//
// Friendship states:
//   - "friends"    → dark blue button with dropdown arrow
//   - "not friends" → outlined "add friend" button
//
// Pressing the friends button opens a bottom sheet (unfr popup) with:
//   - REMOVE FRIEND → shows a warning confirmation popup, then unfriends
//   - SEE LOCATION  → placeholder for future feature
// ─────────────────────────────────────────────

import { useState } from "react";
import Header from "./Header";
import NavBar from "./NavBar";

import "./FriendProfilePage.css";
import "./GroupDetailPage.css";

// ── SVG icon components ──

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Person silhouette — used in the "friends" button
function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Person with X — used in the "Remove Friend" button
function RemoveFriendIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="7" r="4" stroke="white" strokeWidth="2"/>
      <path d="M2 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 14l4 4M21 14l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Person with map pin — used in the "See Location" button
function LocationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="7" r="4" stroke="white" strokeWidth="2"/>
      <path d="M2 20c0-4 3.6-7 8-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 13c-2.2 0-4 1.8-4 4 0 2.5 4 6 4 6s4-3.5 4-6c0-2.2-1.8-4-4-4z" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="17" r="1.2" fill="white"/>
    </svg>
  );
}

export default function FriendProfilePage({ friend, onBack, onGroupClick }) {
  const [activeTab, setActiveTab]         = useState("group");
  const [activeSection, setActiveSection] = useState("friends"); // "friends" or "artists" tab
  const [isFriend, setIsFriend]           = useState(true);      // friendship status
  const [showPopup, setShowPopup]         = useState(false);     // true = bottom sheet open
  const [showConfirm, setShowConfirm]     = useState(false);     // true = warning confirmation open

  // This friend's own friends list (hardcoded for now)
  const friendsList = [
    { id: 1, name: "Emma Sørensen",     avatar: null },
    { id: 2, name: "Sofie Christensen", avatar: null },
    { id: 3, name: "Andreas Nielsen",   avatar: null },
    { id: 4, name: "Frederik Larsen",   avatar: null },
    { id: 5, name: "Cecilie Winther",   avatar: null },
  ];

  // Called after the user confirms removing the friend in the warning popup
  function handleRemoveFriend() {
    setIsFriend(false);
    setShowConfirm(false);
  }

  return (
    <div className="friend-page">
      <Header showBack onBackClick={onBack} />

      <main className="friend-main">
        {/* ── Top section: avatar, name, friend count, friendship button ── */}
        <div className="friend-top">
          <div className="friend-avatar-wrap">
            {friend.avatar
              ? <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
              : <div className="friend-avatar-placeholder" />}
          </div>
          <div className="friend-info">
            <h1 className="friend-name">{friend.name.toUpperCase()}</h1>
            <p className="friend-count">7 friends</p>
            {isFriend ? (
              // Already friends — opens the bottom sheet with options
              <button className="friend-status-btn" onClick={() => setShowPopup(true)}>
                <PersonIcon />
                friends
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            ) : (
              // Not friends — pressing this re-adds them
              <button className="friend-add-btn" onClick={() => setIsFriend(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="#1B4591" strokeWidth="2"/>
                  <path d="M2 20c0-4 3.6-7 8-7s6 2 7 5" stroke="#1B4591" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 12v6M16 15h6" stroke="#1B4591" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                add friend
              </button>
            )}
          </div>
        </div>

        {/* ── Friends / Artists tab switcher ── */}
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

        {/* ── Friends list ── */}
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

        {/* Artists tab — placeholder for future feature */}
        {activeSection === "artists" && (
          <p className="friend-empty">No artists saved yet.</p>
        )}
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} onGroupClick={onGroupClick} />

      {/* ── Warning popup: shown after pressing REMOVE FRIEND in the bottom sheet ── */}
      {showConfirm && (
        <div className="leave-overlay" onClick={() => setShowConfirm(false)}>
          <div className="leave-card" onClick={e => e.stopPropagation()}>
            <svg width="64" height="58" viewBox="0 0 64 58" fill="none">
              <path d="M32 4L60 54H4L32 4Z" fill="#FFD043" stroke="#1B4591" strokeWidth="3" strokeLinejoin="round"/>
              <text x="32" y="44" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#1B4591">!</text>
            </svg>
            <p className="leave-text">Are you sure you want to remove this friend?</p>
            <div className="leave-btns">
              <button className="leave-btn-back" onClick={() => setShowConfirm(false)}>BACK</button>
              <button className="leave-btn-confirm" onClick={handleRemoveFriend}>REMOVE</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom sheet: shown when the "friends" button is pressed ── */}
      {showPopup && (
        <div className="unfriend-overlay" onClick={() => setShowPopup(false)}>
          <div className="unfriend-sheet" onClick={e => e.stopPropagation()}>
            <div className="unfriend-header">
              {/* Shows only the first name e.g. "LAURA" */}
              <span className="unfriend-name">{friend.name.split(" ")[0].toUpperCase()}</span>
              <button className="unfriend-close" onClick={() => setShowPopup(false)}>✕</button>
            </div>
            {/* REMOVE FRIEND → closes sheet, opens warning confirmation */}
            <button className="unfriend-action-btn" onClick={() => { setShowPopup(false); setShowConfirm(true); }}>
              <span>REMOVE FRIEND</span>
              <RemoveFriendIcon />
            </button>
            {/* SEE LOCATION — placeholder for future map feature */}
            <button className="unfriend-action-btn">
              <span>SEE LOCATION</span>
              <LocationIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
