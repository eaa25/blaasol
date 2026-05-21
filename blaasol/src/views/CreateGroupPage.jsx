// Create Group page — opened from the "+" popup on GroupsPage.
// Lets the user pick a group photo, enter a name, and optionally set an
// invite code. Calls onCreate({ name, avatar, inviteCode }) when submitted.

import { useState, useRef, useEffect } from "react";

import Header from "../components/Header";

import "./GroupDetailPage.css";

export default function CreateGroupPage({ onBack, onCreate }) {
  const [name,   setName]   = useState("");   // group display name
  const [avatar, setAvatar] = useState(null); // base64 image data URL, null = no photo chosen
  const [code,   setCode]   = useState("");   // optional custom invite code

  const nameInputRef = useRef(null);

  // Auto-focus the name field when the page opens
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Converts the picked image file to a base64 data URL for preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  // Validates and passes the new group up to GroupsPage
  function handleCreate() {
    if (!name.trim()) return; // require at least a name
    onCreate({
      name: name.trim(),
      avatar,
      inviteCode: code.trim().toUpperCase() || null,
    });
  }

  return (
    <div className="detail-page">
      <Header variant="back" onBackClick={onBack} />

      <main className="detail-main edit-mode">
        {/* Hidden file input triggered by the "Add photo" label */}
        <input
          id="create-image-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* Group photo preview — shows a grey placeholder until a photo is chosen */}
        <div className="detail-photo-wrap create-placeholder">
          {avatar
            ? <img src={avatar} alt="Group" className="detail-photo" />
            : <div className="create-photo-empty" />}
        </div>

        <label htmlFor="create-image-input" className="edit-link">Add photo</label>

        <input
          ref={nameInputRef}
          className="edit-name-input create-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
          maxLength={40}
        />

        <input
          className="edit-name-input create-field create-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Invite code (e.g. BB345)"
          maxLength={10}
        />

        <button className="edit-done-btn" onClick={handleCreate}>CREATE</button>
      </main>
    </div>
  );
}
