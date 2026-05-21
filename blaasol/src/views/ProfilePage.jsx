// Your personal profile page — opened from the account icon in the header.
// Has three modes:
//   Normal view  — photo, name, friend list, liked artists
//   Edit mode    — change your display name and profile photo
//   Share view   — shows your personal QR code so friends can find you

import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Header          from "../components/Header";
import NavBar          from "../components/NavBar";
import QRPage          from "./QRPage";
import FriendProfilePage from "./FriendProfilePage";
import { ACTS }        from "../actsData";
import { useLikedArtists } from "../useLikedArtists";
import ellapersona     from "../assets/ellapersona.png";
import { friends }     from "../friendsData";

import "./ProfilePage.css";

const PROFILE_KEY = "blaasol_profile";

// Reads saved name + avatar from localStorage
function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Chevron arrow used in the friends list rows
function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Upload / share icon shown next to the EDIT button
function ShareIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M7 8l5-5 5 5" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProfilePage({ onBack }) {
  const [likedArtists] = useLikedArtists();
  const location       = useLocation();

  // Which nav tab was active before opening profile — kept highlighted in the NavBar
  const activeTab = location.state?.activeTab ?? "group";

  const [activeSection, setActiveSection] = useState("friends"); // "friends" or "artists" tab
  const [editing, setEditing]             = useState(false);
  const [showShare, setShowShare]         = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Profile name and photo — loaded from localStorage once on mount
  const [profileName,   setProfileName]   = useState(() => loadProfile()?.name   ?? "ELLA KARBERG");
  const [profileAvatar, setProfileAvatar] = useState(() => loadProfile()?.avatar ?? ellapersona);

  // Temporary edit values — only committed when the user presses DONE
  const [editName,   setEditName]   = useState(profileName);
  const [editAvatar, setEditAvatar] = useState(profileAvatar);

  const nameInputRef = useRef(null);

  // Auto-focus the name field when edit mode opens
  useEffect(() => {
    if (editing && nameInputRef.current) nameInputRef.current.focus();
  }, [editing]);

  // Converts the picked image file to a base64 data URL for preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  // Saves edits and closes edit mode
  function handleDone() {
    setProfileName(editName);
    setProfileAvatar(editAvatar);
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: editName, avatar: editAvatar }));
    setEditing(false);
  }

  // Sub-page: a friend's profile
  if (selectedFriend) {
    return <FriendProfilePage friend={selectedFriend} onBack={() => setSelectedFriend(null)} />;
  }

  // Sub-page: personal QR code so friends can follow you
  if (showShare) {
    return (
      <QRPage
        onBack={() => setShowShare(false)}
        inviteCode="EK155"
        description="Show this QR code or share the invite code with your friends so they can follow you and stay connected during the festival."
      />
    );
  }

  // Edit mode — change name or profile photo
  if (editing) {
    return (
      <div className="profile-page">
        <Header variant="back" onBackClick={() => setEditing(false)} />
        <main className="detail-main edit-mode">
          {/* Hidden file input triggered by the "Edit" label */}
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

  // Acts the user has liked in the schedule
  const likedActs = ACTS.filter(a => likedArtists?.has(a.id));

  return (
    <div className="profile-page">
      <Header variant="back" onBackClick={onBack} />

      <main className="profile-main">
        {/* Avatar, name, friend count, edit + share buttons */}
        <div className="profile-top">
          <img src={profileAvatar} alt={profileName} className="profile-avatar" />
          <div className="profile-info">
            <h1 className="profile-name">{profileName}</h1>
            <p className="profile-friends-count">{friends.length} friends</p>
            <div className="profile-actions">
              <button className="profile-edit-btn" onClick={() => { setEditName(profileName); setEditAvatar(profileAvatar); setEditing(true); }}>
                EDIT
              </button>
              <button className="profile-share-btn" onClick={() => setShowShare(true)}>
                <ShareIcon />
              </button>
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

        {/* Friends tab — tap a friend to open their profile */}
        {activeSection === "friends" && (
          <ul className="profile-list">
            {friends.map((f, i) => (
              <li
                key={f.id}
                className="profile-list-item"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedFriend(f)}
              >
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

        {/* Artists tab — shows acts liked from the schedule */}
        {activeSection === "artists" && likedActs.length === 0 && (
          <p className="profile-empty">No artists saved yet. Like artists in the schedule.</p>
        )}

        {activeSection === "artists" && likedActs.length > 0 && (
          <ul className="profile-list">
            {likedActs.map((act, i) => (
              <li key={act.id} className="profile-list-item">
                <img src={act.img} alt={act.name} className="profile-artist-img" />
                <div className="profile-artist-info">
                  <span className="profile-list-name">{act.name}</span>
                  <span className="profile-artist-meta">{act.time} · {act.venue}</span>
                </div>
                {i < likedActs.length - 1 && <div className="profile-list-divider" />}
              </li>
            ))}
          </ul>
        )}
      </main>

      <NavBar active={activeTab} />
    </div>
  );
}
