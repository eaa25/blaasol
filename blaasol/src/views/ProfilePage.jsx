// ─────────────────────────────────────────────
// ProfilePage — your personal profile
// Opened by tapping the account icon in the header.
// Contains three modes:
//   1. Normal view — shows your photo, name, friends list, share button
//   2. Edit mode   — change your name and profile photo
//   3. Share view  — shows your personal QR code (EK155) via QRPage
// Tapping a friend opens their FriendProfilePage
// ─────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import QRPage from "./QRPage";
import FriendProfilePage from "./FriendProfilePage";

import ellapersona from "../assets/ellapersona.png";

import "./ProfilePage.css";

// Your friends list shown on the profile
const friends = [
  { id: 1, name: "Laura Dahl",        avatar: null },
  { id: 2, name: "Emma Sørensen",     avatar: null },
  { id: 3, name: "Sofie Christensen", avatar: null },
  { id: 4, name: "Andreas Nielsen",   avatar: null },
  { id: 5, name: "Frederik Larsen",   avatar: null },
];

// Arrow icon used in the friends list rows
function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Share / upload icon shown next to the EDIT button
function ShareIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M7 8l5-5 5 5" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProfilePage({ onBack }) {
  const [activeTab, setActiveTab]           = useState("group");
  const [activeSection, setActiveSection]   = useState("friends"); // "friends" or "artists" tab
  const [editing, setEditing]               = useState(false);     // true = edit mode open
  const [showShare, setShowShare]           = useState(false);     // true = show QR share page
  const [selectedFriend, setSelectedFriend] = useState(null);     // friend whose profile to open
  // Current saved profile values
  const [profileName, setProfileName]       = useState("ELLA KARBERG");
  const [profileAvatar, setProfileAvatar]   = useState(ellapersona);
  // Temporary edit values — only saved when DONE is pressed
  const [editName, setEditName]             = useState(profileName);
  const [editAvatar, setEditAvatar]         = useState(profileAvatar);
  const nameInputRef = useRef(null);

  // Auto-focus the name input when edit mode opens
  useEffect(() => {
    if (editing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editing]);

  // Reads the chosen image file and converts it to a base64 URL for preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  // Saves the edited name and avatar back to the profile
  function handleDone() {
    setProfileName(editName);
    setProfileAvatar(editAvatar);
    setEditing(false);
  }

  // ── Page routing ──
  if (selectedFriend) {
    return <FriendProfilePage friend={selectedFriend} onBack={() => setSelectedFriend(null)} onGroupClick={onBack} />;
  }

  // Share button — opens personal QR code page
  if (showShare) {
    return (
      <QRPage
        onBack={() => setShowShare(false)}
        inviteCode="EK155"
        description="Show this QR code or share the invite code with your friends so they can follow you and stay connected during the festival."
      />
    );
  }

  // ── Edit mode ──
  if (editing) {
    return (
      <div className="profile-page">
        <Header showBack onBackClick={() => setEditing(false)} />
        <main className="detail-main edit-mode">
          {/* Hidden file input — triggered by the "Edit" label below */}
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <div className="profile-edit-photo-wrap">
            <img src={editAvatar} alt="Profile" className="profile-edit-photo" />
          </div>
          {/* Clicking "Edit" opens the file picker to change your profile photo */}
          <label htmlFor="profile-image-input" className="edit-link">Edit</label>
          <input
            ref={nameInputRef}
            className="edit-name-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
          />
          <button className="edit-done-btn" onClick={handleDone}>DONE</button>
        </main>
      </div>
    );
  }

  // ── Normal profile view ──
  return (
    <div className="profile-page">
      <Header showBack onBackClick={onBack} />

      <main className="profile-main">
        {/* Top section: photo, name, friend count, edit & share buttons */}
        <div className="profile-top">
          <img src={profileAvatar} alt={profileName} className="profile-avatar" />
          <div className="profile-info">
            <h1 className="profile-name">{profileName}</h1>
            <p className="profile-friends-count">{friends.length} friends</p>
            <div className="profile-actions">
              {/* EDIT opens edit mode to change name/photo */}
              <button className="profile-edit-btn" onClick={() => { setEditName(profileName); setEditAvatar(profileAvatar); setEditing(true); }}>EDIT</button>
              {/* Share opens the personal QR code page */}
              <button className="profile-share-btn" onClick={() => setShowShare(true)}><ShareIcon /></button>
            </div>
          </div>
        </div>

        {/* Friends / Artists tab switcher */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeSection === "friends" ? "active" : ""}`}
            onClick={() => setActiveSection("friends")}
          >
            Friends
          </button>
          <span className="profile-tab-divider">|</span>
          <button
            className={`profile-tab ${activeSection === "artists" ? "active" : ""}`}
            onClick={() => setActiveSection("artists")}
          >
            Artists
          </button>
        </div>

        {/* Friends list — tapping a friend opens their FriendProfilePage */}
        {activeSection === "friends" && (
          <ul className="profile-list">
            {friends.map((f, i) => (
              <li key={f.id} className="profile-list-item" style={{ cursor: "pointer" }} onClick={() => setSelectedFriend(f)}>
                <div className="profile-list-avatar">
                  {f.avatar
                    ? <img src={f.avatar} alt={f.name} />
                    : <div className="profile-list-placeholder" />}
                </div>
                <span className="profile-list-name">{f.name}</span>
                <ArrowIcon />
                {i < friends.length - 1 && <div className="profile-list-divider" />}
              </li>
            ))}
          </ul>
        )}

        {/* Artists tab — placeholder for future feature */}
        {activeSection === "artists" && (
          <p className="profile-empty">No artists saved yet.</p>
        )}
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} onGroupClick={onBack} />
    </div>
  );
}
