import { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { ACTS, FRIENDS } from "../actsData";
import { useLikedArtists } from "../useLikedArtists";
import "./Schedule.css";

function HeartIcon({ filled }) {
  return filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" strokeWidth="2" />
    </svg>
  );
}

// Max 2 overlapping circular profile photos for friends who liked an act
function FriendCircles({ friendIds }) {
  if (!friendIds || friendIds.length === 0) return <div className="friend-circles-empty" />;
  return (
    <div className="friend-circles">
      {friendIds.slice(0, 2).map((fid) => {
        const f = FRIENDS.find((f) => f.id === fid);
        if (!f) return null;
        return <img key={fid} src={f.img} alt={f.name} className="friend-circle" title={f.name} />;
      })}
    </div>
  );
}

export default function Schedule() {
  const [likedArtists, toggleLike] = useLikedArtists();
  const [activeTab, setActiveTab] = useState("my");

  return (
    <div className="schedule-page">
      <Header />

      {/* MY SCHEDULE / GROUP SCHEDULE toggle */}
      <div className="schedule-tabs">
        <button
          className={`schedule-tab${activeTab === "my" ? " active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          MY SCHEDULE
        </button>
        <button
          className={`schedule-tab${activeTab === "group" ? " active" : ""}`}
          onClick={() => setActiveTab("group")}
        >
          GROUP SCHEDULE
        </button>
      </div>

      {/* Scrollable acts list */}
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

              {/* MY SCHEDULE: heart like button */}
              {activeTab === "my" && (
                <button
                  className={`act-heart-btn${liked ? " liked" : ""}`}
                  onClick={() => toggleLike(act.id)}
                  aria-label={liked ? "Unlike" : "Like"}
                >
                  <HeartIcon filled={liked} />
                </button>
              )}

              {/* GROUP SCHEDULE: friend circles */}
              {activeTab === "group" && (
                <FriendCircles friendIds={act.friendLikes} />
              )}
            </div>
          );
        })}
      </main>

      <NavBar />
    </div>
  );
}
