// Groups list page — the main groups screen.
// Shows all groups the user belongs to. Tapping a group opens GroupDetailPage.
// The "+" button opens a popup to create a new group or join one by code.
// Group list is persisted in localStorage so it survives page refreshes.

import { useState, useEffect } from "react";
import Header          from "../components/Header";
import NavBar          from "../components/NavBar";
import GroupDetailPage from "./GroupDetailPage";
import JoinGroupPage   from "./JoinGroupPage";
import CreateGroupPage from "./CreateGroupPage";
import ProfilePage     from "./ProfilePage";

import img1 from "../assets/groupimg/bass&besties.png";
import img2 from "../assets/groupimg/bluecrew.png";
import img3 from "../assets/groupimg/lastones.png";
import img4 from "../assets/groupimg/blaabuddies.png";
import img5 from "../assets/groupimg/miccheckcrew.png";
import img6 from "../assets/groupimg/beerpressure.png";
import img7 from "../assets/groupimg/sunburnsociety.png";

import "./GroupsPage.css";

const GROUPS_KEY = "blaasol_groups";

// Default groups shown on first launch
const groups = [
  { id: 1, name: "Bass & Besties",    avatar: img1, inviteCode: "BB345"   },
  { id: 2, name: "Blue Crew",          avatar: img2, inviteCode: "BLUE123" },
  { id: 3, name: "Last Ones Standing", avatar: img3, inviteCode: "LAST123" },
  { id: 4, name: "Blå Buddies",        avatar: img4, inviteCode: "BLA123"  },
  { id: 5, name: "Mic Check Crew",     avatar: img5, inviteCode: "MIC123"  },
  { id: 6, name: "Beer Pressure",      avatar: img6, inviteCode: "BEER789" },
  { id: 7, name: "Sunburn Society",    avatar: img7, inviteCode: "SUN123"  },
];

// Loads saved group list from localStorage, falls back to the default list
function loadGroups() {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    return raw ? JSON.parse(raw) : groups;
  } catch {
    return groups;
  }
}

export default function GroupsPage() {
  const [showPopup, setShowPopup]         = useState(false);     // "+" popup visible
  const [selectedGroup, setSelectedGroup] = useState(null);      // group to open in detail view
  const [showJoin, setShowJoin]           = useState(false);     // JoinGroupPage visible
  const [showCreate, setShowCreate]       = useState(false);     // CreateGroupPage visible
  const [showProfile, setShowProfile]     = useState(false);     // ProfilePage visible (from group member tap)
  const [groupList, setGroupList]         = useState(loadGroups); // live group list

  // Persist any change to the group list immediately
  useEffect(() => {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groupList));
  }, [groupList]);

  // Called after editing a group's name or image
  function handleUpdateGroup(updated) {
    setGroupList(prev => prev.map(g => g.id === updated.id ? updated : g));
    setSelectedGroup(updated);
  }

  // Called after the user creates a brand-new group
  function handleCreateGroup({ name, avatar }) {
    const newGroup = { id: Date.now(), name, avatar, inviteCode: null };
    setGroupList(prev => [...prev, newGroup]);
    setShowCreate(false);
  }

  // Called after the user leaves a group — removes it from the list
  function handleLeaveGroup(id) {
    setGroupList(prev => prev.filter(g => g.id !== id));
    setSelectedGroup(null);
  }

  // Checks the entered invite code against current + original groups so
  // the user can rejoin a group they previously left
  function handleJoinByCode(code) {
    const upper = code.toUpperCase();
    let match = groupList.find(g => g.inviteCode === upper);
    if (!match) {
      match = groups.find(g => g.inviteCode === upper);
      if (match) setGroupList(prev => [...prev, match]);
    }
    if (match) {
      setShowJoin(false);
      setSelectedGroup(match);
      return true;
    }
    return false; // wrong code — JoinGroupPage will show an error
  }

  // Sub-page routing based on state
  if (showProfile)  return <ProfilePage onBack={() => setShowProfile(false)} />;
  if (showCreate)   return <CreateGroupPage onBack={() => setShowCreate(false)} onCreate={handleCreateGroup} />;
  if (showJoin)     return <JoinGroupPage   onBack={() => setShowJoin(false)}   onJoin={handleJoinByCode} />;

  if (selectedGroup) {
    return (
      <GroupDetailPage
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
        onUpdate={handleUpdateGroup}
        onLeave={handleLeaveGroup}
        onProfileClick={() => setShowProfile(true)}
      />
    );
  }

  return (
    <div className="groups-page">
      <Header />

      <main className="groups-main">
        <div className="groups-heading">
          <h1 className="groups-title">YOUR GROUPS</h1>
          {/* "+" opens the create / join popup */}
          <button className="add-btn" aria-label="Add group" onClick={() => setShowPopup(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Tap a group to open its detail page */}
        <ul className="groups-list">
          {groupList.map((group, i) => (
            <li key={group.id} className="group-item" onClick={() => setSelectedGroup(group)}>
              <div className="group-avatar">
                <img src={group.avatar} alt={group.name} />
              </div>
              <span className="group-name">{group.name}</span>
              {/* Divider between rows — not after the last item */}
              {i < groups.length - 1 && <div className="group-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar active="group" />

      {/* Create / join popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
            <button className="popup-btn" onClick={() => { setShowPopup(false); setShowCreate(true); }}>
              CREATE A NEW GROUP
            </button>
            <button className="popup-btn" onClick={() => { setShowPopup(false); setShowJoin(true); }}>
              JOIN AN EXISTING GROUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
