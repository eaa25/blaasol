import { useState } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import GroupDetailPage from "./GroupDetailPage";
import JoinGroupPage from "./JoinGroupPage";
import CreateGroupPage from "./CreateGroupPage";
import ProfilePage from "./ProfilePage";
import img1 from "./assets/anastasia.png";
import img2 from "./assets/selvglad.png";
import img3 from "./assets/bonad.png";
import img4 from "./assets/specktors.png";
import img5 from "./assets/gnags.png";
import img6 from "./assets/zarpaulo.png";
import "./GroupsPage.css";

const groups = [
  { id: 1, name: "Bass & Besties",     avatar: img1, inviteCode: "BB345" },
  { id: 2, name: "Blue Crew",           avatar: img2 },
  { id: 3, name: "Last Ones Standing",  avatar: img3 },
  { id: 4, name: "Blå Buddies",         avatar: img4 },
  { id: 5, name: "Mic Check Crew",      avatar: img5 },
  { id: 6, name: "Beer Pressure",       avatar: img6 },
  { id: 7, name: "Sunburn Society",     avatar: img6 },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab]         = useState("group");
  const [showPopup, setShowPopup]         = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showJoin, setShowJoin]           = useState(false);
  const [showCreate, setShowCreate]       = useState(false);
  const [showProfile, setShowProfile]     = useState(false);
  const [groupList, setGroupList]         = useState(groups);

  // UPDATE: saves edited name and avatar back into the list
  function handleUpdateGroup(updated) {
    setGroupList(prev => prev.map(g => g.id === updated.id ? updated : g));
    setSelectedGroup(updated);
  }

  // CREATE: add new group to groupList with a generated id, name, and chosen avatar
  function handleCreateGroup({ name, avatar }) {
    const newGroup = { id: Date.now(), name, avatar, inviteCode: null };
    setGroupList(prev => [...prev, newGroup]);
    setShowCreate(false);
  }

  // DELETE: remove group from groupList by id
  function handleLeaveGroup(id) {
    setGroupList(prev => prev.filter(g => g.id !== id));
    setSelectedGroup(null);
  }

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
    return false;
  }

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
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
      />
    );
  }

  return (
    <div className="groups-page">
      <Header onTicketsClick={() => {}} onProfileClick={() => setShowProfile(true)} />

      <main className="groups-main">
        <div className="groups-heading">
          <h1 className="groups-title">YOUR GROUPS</h1>
          <button className="add-btn" aria-label="Add group" onClick={() => setShowPopup(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <ul className="groups-list">
          {groupList.map((group, i) => (
            <li key={group.id} className="group-item" onClick={() => setSelectedGroup(group)}>
              <img src={group.avatar} alt={group.name} className="group-avatar" />
              <span className="group-name">{group.name}</span>
              {i < groups.length - 1 && <div className="group-divider" />}
            </li>
          ))}
        </ul>
      </main>

      <NavBar active={activeTab} onTabChange={setActiveTab} />

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
            {/* CREATE: open a form to enter group name and pick avatar */}
            <button className="popup-btn" onClick={() => { setShowPopup(false); setShowCreate(true); }}>CREATE A NEW GROUP</button>
            {/* JOIN: input an invite code to join an existing group */}
            <button className="popup-btn" onClick={() => { setShowPopup(false); setShowJoin(true); }}>JOIN AN EXISTING GROUP</button>
          </div>
        </div>
      )}
    </div>
  );
}
