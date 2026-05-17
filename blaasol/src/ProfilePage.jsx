import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import ellapersona from "./assets/ellapersona.png";
import "./ProfilePage.css";

const friends = [
  { id: 1, name: "Laura Dahl",        avatar: null },
  { id: 2, name: "Emma Sørensen",     avatar: null },
  { id: 3, name: "Sofie Christensen", avatar: null },
  { id: 4, name: "Andreas Nielsen",   avatar: null },
  { id: 5, name: "Frederik Larsen",   avatar: null },
];

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v13M7 8l5-5 5 5" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="#1B4591" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ProfilePage({ onBack }) {
  const [activeTab, setActiveTab]         = useState("group");
  const [activeSection, setActiveSection] = useState("friends");
  const [editing, setEditing]             = useState(false);
  const [profileName, setProfileName]     = useState("ELLA KARBERG");
  const [profileAvatar, setProfileAvatar] = useState(ellapersona);
  const [editName, setEditName]           = useState(profileName);
  const [editAvatar, setEditAvatar]       = useState(profileAvatar);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editing]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleDone() {
    setProfileName(editName);
    setProfileAvatar(editAvatar);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="profile-page">
        <Header showBack onBackClick={() => setEditing(false)} />
        <main className="detail-main edit-mode">
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

  return (
    <div className="profile-page">
      <Header showBack onBackClick={onBack} />

      <main className="profile-main">
        <div className="profile-top">
          <img src={profileAvatar} alt={profileName} className="profile-avatar" />
          <div className="profile-info">
            <h1 className="profile-name">{profileName}</h1>
            <p className="profile-friends-count">{friends.length} friends</p>
            <div className="profile-actions">
              <button className="profile-edit-btn" onClick={() => { setEditName(profileName); setEditAvatar(profileAvatar); setEditing(true); }}>EDIT</button>
              <button className="profile-share-btn"><ShareIcon /></button>
            </div>
          </div>
        </div>

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

        {activeSection === "friends" && (
          <ul className="profile-list">
            {friends.map((f, i) => (
              <li key={f.id} className="profile-list-item">
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

        {activeSection === "artists" && (
          <p className="profile-empty">No artists saved yet.</p>
        )}
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
