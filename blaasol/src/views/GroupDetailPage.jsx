// Detail page for a single group.
// Shows the group image, name, action buttons (schedule, QR, map, leave),
// and the member list. Tapping a member opens their profile. Tapping "You"
// opens your own ProfilePage via the onProfileClick callback.
// The group name and image can be edited directly from this page.

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ellapersona from "../assets/ellapersona.png";
import programIcon from "../assets/program icon.png";
import vectorIcon  from "../assets/Vector.png";
import mapIcon     from "../assets/map icon.png";

import img1 from "../assets/laura.jpeg";
import img2 from "../assets/sofie.png";
import img3 from "../assets/emma.png";
import img4 from "../assets/cecilie.jpeg";

import Header          from "../components/Header";
import NavBar          from "../components/NavBar";
import QRPage          from "./QRPage";
import FriendProfilePage from "./FriendProfilePage";

import "./GroupDetailPage.css";

// Hardcoded member list for this group
const members = [
  { id: 1, name: "You",               avatar: ellapersona },
  { id: 2, name: "Laura Dahl",        avatar: img1 },
  { id: 3, name: "Sofie Christensen", avatar: img2 },
  { id: 4, name: "Emma Sørensen",     avatar: img3 },
  { id: 5, name: "Cecilie Winther",   avatar: img4 },
];

export default function GroupDetailPage({ group, onBack, onUpdate, onLeave, onProfileClick }) {
  const navigate = useNavigate();

  const [editing, setEditing]                 = useState(false);
  const [showQR, setShowQR]                   = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedMember, setSelectedMember]   = useState(null); // member whose profile to open

  // Temporary edit values — only saved when DONE is pressed
  const [editName,   setEditName]   = useState(group.name);
  const [editAvatar, setEditAvatar] = useState(group.avatar);

  const nameInputRef = useRef(null);

  // Auto-focus the name input when edit mode opens
  useEffect(() => {
    if (editing) nameInputRef.current?.focus();
  }, [editing]);

  // Converts the picked image file to a base64 data URL for preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  // Saves the edited name and image back to the group list
  function handleDone() {
    onUpdate({ ...group, name: editName, avatar: editAvatar });
    setEditing(false);
  }

  // Sub-page: a member's full profile
  if (selectedMember) {
    return <FriendProfilePage friend={selectedMember} onBack={() => setSelectedMember(null)} onGroupClick={onBack} />;
  }

  // Sub-page: group QR code
  if (showQR) {
    return <QRPage group={group} onBack={() => setShowQR(false)} />;
  }

  // Edit mode — change group name or image
  if (editing) {
    return (
      <div className="detail-page">
        <Header variant="back" onBackClick={() => setEditing(false)} />
        <main className="detail-main edit-mode">
          {/* Hidden file input triggered by the "Edit" label */}
          <input id="group-image-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
          <div className="detail-photo-wrap">
            <img src={editAvatar} alt="Group" className="detail-photo" />
          </div>
          <label htmlFor="group-image-input" className="edit-link">Edit</label>
          <input
            ref={nameInputRef}
            className="edit-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Group name"
            maxLength={40}
          />
          <button className="edit-done-btn" onClick={handleDone}>DONE</button>
        </main>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Header variant="back" onBackClick={onBack} />

      <main className="detail-main">
        <div className="detail-photo-wrap">
          <img src={group.avatar} alt={group.name} className="detail-photo" />
        </div>

        <h1 className="detail-name">{group.name.toUpperCase()}</h1>

        <button
          className="detail-change"
          onClick={() => { setEditName(group.name); setEditAvatar(group.avatar); setEditing(true); }}
        >
          Change name and image
        </button>

        {/* Action buttons row */}
        <div className="detail-actions">
          {/* Opens the group schedule tab */}
          <button
            className="detail-action-btn"
            onClick={() => navigate("/group-schedule", { state: { defaultTab: "group" } })}
          >
            <img src={programIcon} alt="Group schedule" className="detail-action-icon" />
            <span>Group schedule</span>
          </button>

          {/* Shows the group's invite QR code */}
          <button className="detail-action-btn" onClick={() => setShowQR(true)}>
            <img src={vectorIcon} alt="Show QR code" className="detail-action-icon" />
            <span>Show QR code</span>
          </button>

          {/* Navigates to the map page */}
          <button className="detail-action-btn" onClick={() => navigate("/map")}>
            <img src={mapIcon} alt="Find my group" className="detail-action-icon" />
            <span>Find my group</span>
          </button>

          {/* Leave group — triggers a confirmation dialog */}
          <button className="detail-action-btn detail-leave-btn" onClick={() => setShowLeaveConfirm(true)}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="detail-action-icon">
              <path d="M13 18h14M22 13l5 5-5 5" stroke="#e03c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 9H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11" stroke="#e03c3c" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>Leave</span>
          </button>
        </div>

        <p className="detail-members-label">Members</p>

        {/* Member list — tap "You" to open your own profile, others to open theirs */}
        <ul className="detail-members-list">
          {members.map((m, i) => (
            <li
              key={m.id}
              className="detail-member-item detail-member-clickable"
              onClick={() => m.name === "You" ? onProfileClick() : setSelectedMember(m)}
            >
              <div className="detail-member-avatar">
                <img src={m.avatar} alt={m.name} />
              </div>
              <span className="detail-member-name">{m.name}</span>
              {i < members.length - 1 && <div className="detail-member-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar />

      {/* Leave group confirmation popup */}
      {showLeaveConfirm && (
        <div className="leave-overlay" onClick={() => setShowLeaveConfirm(false)}>
          <div className="leave-card" onClick={(e) => e.stopPropagation()}>
            <svg width="64" height="58" viewBox="0 0 64 58" fill="none">
              <path d="M32 4L60 54H4L32 4Z" fill="#FFD043" stroke="#1B4591" strokeWidth="3" strokeLinejoin="round" />
              <text x="32" y="44" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#1B4591">!</text>
            </svg>
            <p className="leave-text">Are you sure you want to leave this group?</p>
            <div className="leave-btns">
              <button className="leave-btn-back"    onClick={() => setShowLeaveConfirm(false)}>BACK</button>
              <button className="leave-btn-confirm" onClick={() => { setShowLeaveConfirm(false); onLeave(group.id); }}>LEAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
