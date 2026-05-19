// ─────────────────────────────────────────────
// GroupDetailPage — shows a single group's info
// Opened when you tap a group in GroupsPage.
// Contains three modes:
//   1. Normal view — photo, name, action buttons, members list
//   2. Edit mode   — change the group name and photo (UPDATE in CRUD)
//   3. QR view     — shows the group's invite QR code
// Tapping a member opens their FriendProfilePage (or your own profile if "You")
// ─────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ellapersona from "../assets/ellapersona.png";
import programIcon from "../assets/program icon.png";
import vectorIcon from "../assets/Vector.png";
import mapIcon from "../assets/map icon.png";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import QRPage from "./QRPage";
import FriendProfilePage from "./FriendProfilePage";

import "./GroupDetailPage.css";

const members = [
  { id: 1, name: "You", avatar: ellapersona },
  { id: 2, name: "Laura Dahl", avatar: null },
  { id: 3, name: "Sofie Christensen", avatar: null },
  { id: 4, name: "Emma Sørensen", avatar: null },
  { id: 5, name: "Cecilie Winther", avatar: null },
];

export default function GroupDetailPage({
  group,
  onBack,
  onUpdate,
  onLeave,
  onProfileClick,
}) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("group");
  const [editing, setEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [editName, setEditName] = useState(group.name);
  const [editAvatar, setEditAvatar] = useState(group.avatar);

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      nameInputRef.current?.focus();
    }
  }, [editing]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleDone() {
    onUpdate({ ...group, name: editName, avatar: editAvatar });
    setEditing(false);
  }

  if (selectedMember) {
    return (
      <FriendProfilePage
        friend={selectedMember}
        onBack={() => setSelectedMember(null)}
        onGroupClick={onBack}
      />
    );
  }

  if (showQR) {
    return <QRPage group={group} onBack={() => setShowQR(false)} />;
  }

  if (editing) {
    return (
      <div className="detail-page">
        <Header variant="back" onBackClick={() => setEditing(false)} />

        <main className="detail-main edit-mode">
          <input
            id="group-image-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <div className="detail-photo-wrap">
            <img src={editAvatar} alt="Group" className="detail-photo" />
          </div>

          <label htmlFor="group-image-input" className="edit-link">
            Edit
          </label>

          <input
            ref={nameInputRef}
            className="edit-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Group name"
            maxLength={40}
          />

          <button className="edit-done-btn" onClick={handleDone}>
            DONE
          </button>
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
          onClick={() => {
            setEditName(group.name);
            setEditAvatar(group.avatar);
            setEditing(true);
          }}
        >
          Change name and image
        </button>

        <div className="detail-actions">
          <button
            className="detail-action-btn"
            onClick={() => navigate("/schedule")}
          >
            <img
              src={programIcon}
              alt="Group schedule"
              className="detail-action-icon"
            />
            <span>Group schedule</span>
          </button>

          <button
            className="detail-action-btn"
            onClick={() => setShowQR(true)}
          >
            <img
              src={vectorIcon}
              alt="Show QR code"
              className="detail-action-icon"
            />
            <span>Show QR code</span>
          </button>

          <button
            className="detail-action-btn"
            onClick={() => navigate("/map")}
          >
            <img
              src={mapIcon}
              alt="Find my group"
              className="detail-action-icon"
            />
            <span>Find my group</span>
          </button>

          <button
            className="detail-action-btn detail-leave-btn"
            onClick={() => setShowLeaveConfirm(true)}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              className="detail-action-icon"
            >
              <path
                d="M13 18h14M22 13l5 5-5 5"
                stroke="#e03c3c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 9H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11"
                stroke="#e03c3c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Leave</span>
          </button>
        </div>

        <p className="detail-members-label">Members</p>

        <ul className="detail-members-list">
          {members.map((m, i) => (
            <li
              key={m.id}
              className="detail-member-item detail-member-clickable"
              onClick={() =>
                m.name === "You" ? onProfileClick() : setSelectedMember(m)
              }
            >
              <div className="detail-member-avatar">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.name} />
                ) : (
                  <div className="detail-member-placeholder" />
                )}
              </div>

              <span className="detail-member-name">{m.name}</span>

              {i < members.length - 1 && (
                <div className="detail-member-divider" />
              )}
            </li>
          ))}
        </ul>
      </main>

      <NavBar
        active={activeTab}
        onTabChange={setActiveTab}
        onGroupClick={onBack}
      />

      {showLeaveConfirm && (
        <div
          className="leave-overlay"
          onClick={() => setShowLeaveConfirm(false)}
        >
          <div className="leave-card" onClick={(e) => e.stopPropagation()}>
            <svg width="64" height="58" viewBox="0 0 64 58" fill="none">
              <path
                d="M32 4L60 54H4L32 4Z"
                fill="#FFD043"
                stroke="#1B4591"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <text
                x="32"
                y="44"
                textAnchor="middle"
                fontSize="26"
                fontWeight="bold"
                fill="#1B4591"
              >
                !
              </text>
            </svg>

            <p className="leave-text">
              Are you sure you want to leave this group?
            </p>

            <div className="leave-btns">
              <button
                className="leave-btn-back"
                onClick={() => setShowLeaveConfirm(false)}
              >
                BACK
              </button>

              <button
                className="leave-btn-confirm"
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onLeave(group.id);
                }}
              >
                LEAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}