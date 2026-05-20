// ─────────────────────────────────────────────
// GroupSchedulePage
//
// Shows festival acts liked by group members.
//
// Features:
// - Displays group-liked artists
// - Shows overlapping friend avatars
// - Lets user switch back to MY SCHEDULE
// - Opened from GroupDetailPage
// ─────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import { ACTS, FRIENDS } from "../actsData";

import "./Schedule.css";

// ─────────────────────────────────────────────
// FriendCircles
//
// Small overlapping avatars showing which
// friends liked a specific artist.
//
// Only first 2 avatars are displayed.
// ─────────────────────────────────────────────
function FriendCircles({ friendIds }) {

  // Empty placeholder if nobody liked the artist
  if (!friendIds || friendIds.length === 0) {
    return <div className="friend-circles-empty" />;
  }

  // Limits visible avatars to maximum 2
  const visible = friendIds.slice(0, 2);

  return (
    <div className="friend-circles">

      {visible.map((fid) => {

        // Finds matching friend object
        const f = FRIENDS.find((f) => f.id === fid);

        if (!f) return null;

        return (
          <img
            key={fid}
            src={f.img}
            alt={f.name}
            className="friend-circle"
            title={f.name}
          />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────
export default function GroupSchedule({
  onGroupClick,
  onMenuClick,
  onProfileClick,
}) {

  // Used for switching between pages
  const navigate = useNavigate();

  return (
    <div className="schedule-page">

      {/* Top header */}
      <Header onProfileClick={onProfileClick} />

      {/* ───────────────────────────────────── */}
      {/* Schedule toggle buttons              */}
      {/* ───────────────────────────────────── */}
      <div className="schedule-tabs">

        {/* Navigates back to personal schedule */}
        <button
          className="schedule-tab"
          onClick={() => navigate("/schedule")}
        >
          MY SCHEDULE
        </button>

        {/* Current active page */}
        <button className="schedule-tab active">
          GROUP SCHEDULE
        </button>
      </div>

      {/* ───────────────────────────────────── */}
      {/* Festival acts list                   */}
      {/* ───────────────────────────────────── */}
      <main className="schedule-list">

        {ACTS.map((act) => (
          <div key={act.id} className="act-row">

            {/* Time */}
            <span className="act-time">
              {act.time}
            </span>

            {/* Artist image */}
            <img
              src={act.img}
              alt={act.name}
              className="act-img"
            />

            {/* Artist information */}
            <div className="act-info">

              <span className="act-name">
                {act.name}
              </span>

              <span className="act-venue">
                {act.venue}
              </span>
            </div>

            {/* Friends who liked this artist */}
            <FriendCircles friendIds={act.friendLikes} />
          </div>
        ))}
      </main>

      {/* Bottom navigation bar */}
      <NavBar
        active="schedule"
        onGroupClick={onGroupClick}
        onMenuClick={onMenuClick}
      />
    </div>
  );
}