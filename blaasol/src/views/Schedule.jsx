// ─────────────────────────────────────────────
// Schedule.jsx
//
// Personal festival schedule page.
//
// Features:
// - Like / unlike artists
// - Liked artists automatically appear
//   in ProfilePage → Artists tab
// - Switch to GroupSchedule page
// ─────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import { ACTS } from "../actsData";

// Shared liked artists hook
// Used both here and in ProfilePage
import { useLikedArtists } from "../useLikedArtists";

import "./Schedule.css";

// ─────────────────────────────────────────────
// HeartIcon
//
// Filled = liked
// Empty = not liked
// ─────────────────────────────────────────────
function HeartIcon({ filled }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────
export default function Schedule({
  onProfileClick,
}) {

  // Used to navigate to GroupSchedule page
  const navigate = useNavigate();

  // Shared liked artists state
  // This is the SAME data used by ProfilePage
  const [likedArtists, setLikedArtists] = useLikedArtists();

  // ───────────────────────────────────────────
  // Toggles artist like/unlike
  //
  // If artist already liked → remove it
  // If artist not liked → add it
  //
  // Changes automatically appear in ProfilePage
  // because both pages use useLikedArtists()
  // ───────────────────────────────────────────
  function toggleLike(id) {

    setLikedArtists((prev) => {

      const updated = new Set(prev);

      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }

      return updated;
    });
  }

  return (
    <div className="schedule-page">

      {/* Top header */}
      <Header onProfileClick={onProfileClick} />

      {/* ───────────────────────────────────── */}
      {/* Schedule toggle buttons              */}
      {/* ───────────────────────────────────── */}
      <div className="schedule-tabs">

        {/* Current active page */}
        <button className="schedule-tab active">
          MY SCHEDULE
        </button>

        {/* Opens GroupSchedule page */}
        <button
          className="schedule-tab"
          onClick={() => navigate("/group-schedule")}
        >
          GROUP SCHEDULE
        </button>
      </div>

      {/* ───────────────────────────────────── */}
      {/* Festival acts list                   */}
      {/* ───────────────────────────────────── */}
      <main className="schedule-list">

        {ACTS.map((act) => {

          // Checks if this artist is liked
          const liked = likedArtists.has(act.id);

          return (
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

              {/* ───────────────────────────── */}
              {/* Like button                   */}
              {/* ───────────────────────────── */}
              <button
                className={`act-heart-btn${liked ? " liked" : ""}`}
                onClick={() => toggleLike(act.id)}
                aria-label={liked ? "Unlike" : "Like"}
              >
                <HeartIcon filled={liked} />
              </button>
            </div>
          );
        })}
      </main>

      {/* Bottom navbar */}
      <NavBar />
    </div>
  );
}