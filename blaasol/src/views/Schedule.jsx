// Personal schedule page.
// Lists all festival acts. The user can like/unlike each artist with the
// heart button — liked artists also appear in the Artists tab on ProfilePage.
// A toggle at the top switches to GroupSchedule.

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import { ACTS } from "../actsData";
import { useLikedArtists } from "../useLikedArtists";

import "./Schedule.css";

// Heart button icon — filled when liked, outline when not
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

export default function Schedule() {
  const navigate = useNavigate();

  // Shared liked-artists state — stored in localStorage so ProfilePage stays in sync
  const [likedArtists, setLikedArtists] = useLikedArtists();

  return (
    <div className="schedule-page">
      <Header />

      {/* MY SCHEDULE / GROUP SCHEDULE toggle */}
      <div className="schedule-tabs">
        <button className="schedule-tab active">MY SCHEDULE</button>
        <button className="schedule-tab" onClick={() => navigate("/group-schedule")}>
          GROUP SCHEDULE
        </button>
      </div>

      {/* One row per festival act */}
      <main className="schedule-list">
        {ACTS.map((act) => {
          const liked = likedArtists.has(act.id);
          return (
            <div key={act.id} className="act-row">
              <span className="act-time">{act.time}</span>
              <img src={act.img} alt={act.name} className="act-img" />
              <div className="act-info">
                <span className="act-name">{act.name}</span>
                <span className="act-venue">{act.venue}</span>
              </div>
              <button
                className={`act-heart-btn${liked ? " liked" : ""}`}
                onClick={() => setLikedArtists(act.id)}
                aria-label={liked ? "Unlike" : "Like"}
              >
                <HeartIcon filled={liked} />
              </button>
            </div>
          );
        })}
      </main>

      <NavBar />
    </div>
  );
}
