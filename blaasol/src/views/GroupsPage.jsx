// ─────────────────────────────────────────────
// GroupsPage — main screen showing all your groups
// This is the home base of the app. From here the user can:
//   - View all groups they belong to
//   - Open a group to see its details
//   - Create a new group or join an existing one via the + button
//   - Open their profile via the account icon in the header
// ─────────────────────────────────────────────

import { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import GroupDetailPage from "./GroupDetailPage";
import JoinGroupPage from "./JoinGroupPage";
import CreateGroupPage from "./CreateGroupPage";
import ProfilePage from "./ProfilePage";
import SchedulePage from "./SchedulePage";
import img1 from "../assets/groupimg/bass&besties.png";
import img2 from "../assets/groupimg/bluecrew.png";
import img3 from "../assets/groupimg/lastones.png";
import img4 from "../assets/groupimg/blaabuddies.png";
import img5 from "../assets/groupimg/miccheckcrew.png";
import img6 from "../assets/groupimg/beerpressure.png";
import img7 from "../assets/groupimg/sunburnsociety.png";
import "./GroupsPage.css";

// Starting list of groups — each has an id, name, avatar image, and optional invite code
const groups = [
  { id: 1, name: "Bass & Besties",     avatar: img1, inviteCode: "BB345" },
  { id: 2, name: "Blue Crew",           avatar: img2, inviteCode: "BLUE123" },
  { id: 3, name: "Last Ones Standing",  avatar: img3, inviteCode: "LAST123" },
  { id: 4, name: "Blå Buddies",         avatar: img4, inviteCode: "BLA123" },
  { id: 5, name: "Mic Check Crew",      avatar: img5, inviteCode: "MIC123" },
  { id: 6, name: "Beer Pressure",       avatar: img6, inviteCode: "BEER789" },
  { id: 7, name: "Sunburn Society",     avatar: img7, inviteCode: "SUN123" },
];

export default function GroupsPage() {
  // Which nav tab is active (used by NavBar highlight)
  const [activeTab, setActiveTab]     = useState("group");
  // Controls the + popup (create / join options)
  const [showPopup, setShowPopup]     = useState(false);
  // The group the user has tapped into — opens GroupDetailPage
  const [selectedGroup, setSelectedGroup] = useState(null);
  // Controls which full-page view to show
  const [showJoin, setShowJoin]       = useState(false);
  const [showCreate, setShowCreate]   = useState(false);
  const [showProfile, setShowProfile]     = useState(false);
  const [profileFromMenu, setProfileFromMenu] = useState(false); // true = profile was opened via menu
  const [showMenu, setShowMenu]           = useState(false);
  const [showSchedule, setShowSchedule]   = useState(false);
  // Set of act IDs the user has liked from the schedule
  const [likedArtists, setLikedArtists]   = useState(new Set());
  // Live list of groups — updated when user creates, edits or leaves a group
  const [groupList, setGroupList]     = useState(groups);

  // UPDATE: saves edited name and avatar back into the list
  function handleUpdateGroup(updated) {
    setGroupList(prev => prev.map(g => g.id === updated.id ? updated : g));
    setSelectedGroup(updated);
  }

  // CREATE: adds a new group to the list with a generated id
  function handleCreateGroup({ name, avatar }) {
    const newGroup = { id: Date.now(), name, avatar, inviteCode: null };
    setGroupList(prev => [...prev, newGroup]);
    setShowCreate(false);
  }

  // DELETE (Leave): removes the group from the list and goes back to this screen
  function handleLeaveGroup(id) {
    setGroupList(prev => prev.filter(g => g.id !== id));
    setSelectedGroup(null);
  }

  // JOIN: looks up invite code in current list, then falls back to the original groups
  // so the user can rejoin a group they previously left
  function handleJoinByCode(code) {
    const upper = code.toUpperCase();
    let match = groupList.find(g => g.inviteCode === upper);
    if (!match) {
      // check original groups in case the user previously left it
      match = groups.find(g => g.inviteCode === upper);
      if (match) {
        setGroupList(prev => [...prev, match]);
      }
    }
    if (match) {
      setShowJoin(false);
      setSelectedGroup(match);
      return true;
    }
    return false; // wrong code — JoinGroupPage shows an error
  }

  // Toggles an act in/out of the liked set
  function handleToggleLike(actId) {
    setLikedArtists(prev => {
      const next = new Set(prev);
      next.has(actId) ? next.delete(actId) : next.add(actId);
      return next;
    });
  }

  // ── Page routing — show the right screen based on state ──
  if (showSchedule) {
    return <SchedulePage
      likedArtists={likedArtists}
      onToggleLike={handleToggleLike}
      onGroupClick={() => { setShowSchedule(false); setActiveTab("group"); }}
      onMenuClick={() => { setShowSchedule(false); setShowMenu(true); }}
      onProfileClick={() => { setShowSchedule(false); setShowProfile(true); }}
    />;
  }

  if (showMenu) {
    return <MenuPage
      onGroupClick={() => setShowMenu(false)}
      onAccountClick={() => { setShowMenu(false); setShowProfile(true); setProfileFromMenu(true); }}
    />;
  }

  if (showProfile) {
    return <ProfilePage
      likedArtists={likedArtists}
      onBack={() => {
        setShowProfile(false);
        if (profileFromMenu) { setProfileFromMenu(false); setShowMenu(true); }
      }}
    />;
  }

  if (showCreate) {
    return <CreateGroupPage onBack={() => setShowCreate(false)} onCreate={handleCreateGroup} />;
  }

  if (showJoin) {
    return <JoinGroupPage onBack={() => setShowJoin(false)} onJoin={handleJoinByCode} />;
  }

  if (selectedGroup) {
    return (
      <GroupDetailPage
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
        onUpdate={handleUpdateGroup}
        onLeave={handleLeaveGroup}
        onProfileClick={() => { setProfileFromMenu(false); setShowProfile(true); }}
      />
    );
  }

  // ── Main groups list screen ──
  return (
    <div className="groups-page">
      {/* Header — account icon opens profile */}
      <Header onTicketsClick={() => {}} onProfileClick={() => { setProfileFromMenu(false); setShowProfile(true); }} />

      <main className="groups-main">
        <div className="groups-heading">
          <h1 className="groups-title">YOUR GROUPS</h1>
          {/* + button opens the create/join popup */}
          <button className="add-btn" aria-label="Add group" onClick={() => setShowPopup(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* List of groups — tapping one opens GroupDetailPage */}
        <ul className="groups-list">
          {groupList.map((group, i) => (
            <li key={group.id} className="group-item" onClick={() => setSelectedGroup(group)}>
              <div className="group-avatar">
                <img src={group.avatar} alt={group.name} />
              </div>
              <span className="group-name">{group.name}</span>
              {i < groups.length - 1 && <div className="group-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar
        active={activeTab}
        onTabChange={setActiveTab}
        onScheduleClick={() => { setActiveTab("schedule"); setShowSchedule(true); }}
        onMenuClick={() => setShowMenu(true)}
      />

      {/* ── Popup: shown when + is pressed ── */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
            {/* CREATE: opens a form to enter group name, invite code and pick avatar */}
            <button className="popup-btn" onClick={() => { setShowPopup(false); setShowCreate(true); }}>CREATE A NEW GROUP</button>
            {/* JOIN: opens a page to scan QR or enter an invite code */}
            <button className="popup-btn" onClick={() => { setShowPopup(false); setShowJoin(true); }}>JOIN AN EXISTING GROUP</button>
          </div>
        </div>
      )}
    </div>
  );
}
