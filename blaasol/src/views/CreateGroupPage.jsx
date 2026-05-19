import { useState, useRef, useEffect } from "react";

import Header from "../components/Header";

import "./GroupDetailPage.css";

export default function CreateGroupPage({ onBack, onCreate }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [code, setCode] = useState("");

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleCreate() {
    if (!name.trim()) return;

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
        <input
          id="create-image-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <div className="detail-photo-wrap create-placeholder">
          {avatar ? (
            <img src={avatar} alt="Group" className="detail-photo" />
          ) : (
            <div className="create-photo-empty" />
          )}
        </div>

        <label htmlFor="create-image-input" className="edit-link">
          Add photo
        </label>

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

        <button className="edit-done-btn" onClick={handleCreate}>
          CREATE
        </button>
      </main>
    </div>
  );
}