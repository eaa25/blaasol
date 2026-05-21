// Group schedule page.
// Shows all festival acts with small overlapping avatars indicating which
// group members have liked each artist. A toggle at the top switches back
// to the personal schedule.

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import { ACTS, FRIENDS } from "../actsData";

import "./Schedule.css";

// Shows up to 2 circular friend avatars for each act row
function FriendCircles({ friendIds }) {
  if (!friendIds || friendIds.length === 0) {
    return <div className="friend-circles-empty" />;
  }

  return (
    <div className="friend-circles">
      {friendIds.slice(0, 2).map((fid) => {
        const f = FRIENDS.find((f) => f.id === fid);
        if (!f) return null;
        return (
          <img key={fid} src={f.img} alt={f.name} className="friend-circle" title={f.name} />
        );
      })}
    </div>
  );
}

export default function GroupSchedule() {
  const navigate = useNavigate();

  return (
    <div className="schedule-page">
      <Header />

      {/* MY SCHEDULE / GROUP SCHEDULE toggle */}
      <div className="schedule-tabs">
        <button className="schedule-tab" onClick={() => navigate("/schedule")}>
          MY SCHEDULE
        </button>
        <button className="schedule-tab active">GROUP SCHEDULE</button>
      </div>

      {/* One row per act — friend avatars show who in the group liked it */}
      <main className="schedule-list">
        {ACTS.map((act) => (
          <div key={act.id} className="act-row">
            <span className="act-time">{act.time}</span>
            <img src={act.img} alt={act.name} className="act-img" />
            <div className="act-info">
              <span className="act-name">{act.name}</span>
              <span className="act-venue">{act.venue}</span>
            </div>
            <FriendCircles friendIds={act.friendLikes} />
          </div>
        ))}
      </main>

      {/* active="schedule" because /group-schedule has no matching nav item */}
      <NavBar active="schedule" />
    </div>
  );
}
