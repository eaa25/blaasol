import { useState, useRef, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/NavBar";
import SendLocationPage from "./SendLocationPage";
import FriendProfilePage from "./FriendProfilePage";
import InviteMeetPage from "./InviteMeetPage";

import mapImg from "../assets/map.jpg";
import lauraImg from "../assets/laura.jpeg";
import sofieImg from "../assets/sofie.png";
import emmaImg from "../assets/emma.png";
import cecilieImg from "../assets/cecilie.jpeg";

import "./MapPage.css";

// Friends shown on the map and in the friends panel
const friends = [
  { id: 1, name: "Laura Dahl", color: "#00B050", time: "now", location: "toilets – VIP area", avatar: lauraImg, x: 58, y: 16 },
  { id: 2, name: "Sofie Christensen", color: "#A12BCB", time: "now", location: "Byfesten", avatar: sofieImg, x: 30, y: 74 },
  { id: 3, name: "Emma Sørensen", color: "#FF5A2A", time: "5 min. ago", location: "Byfesten", avatar: emmaImg, x: 39, y: 75 },
  { id: 4, name: "Cecilie Winther", color: "#FF003D", time: "now", location: "Juice Bar", avatar: cecilieImg, x: 28, y: 62 },
];

export default function MapPage() {
  // Controls if the bottom friends panel is open or collapsed
  const [panelOpen, setPanelOpen] = useState(true);

  // The friend currently selected on the map
  const [friendDetail, setFriendDetail] = useState(null);

  // Opens the full FriendProfilePage when clicking avatar/name in the detail panel
  const [selectedProfileFriend, setSelectedProfileFriend] = useState(null);

  // Opens the SendLocationPage
  const [showSendLocation, setShowSendLocation] = useState(false);

  // Stores the map zoom and position
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  const mapRef = useRef(null);

  // Opens the InviteMeetPage
  const [showInviteMeet, setShowInviteMeet] = useState(false);

  // Stores mouse drag information while dragging the map
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startMapX: 0,
    startMapY: 0,
  });

  // Resets zoom and closes friend detail panel
  function resetMapView() {
    setTransform({ scale: 1, x: 0, y: 0 });
    setFriendDetail(null);
  }

  function openPopup() {
    console.log("Open popup later");
  }

  // Opens the detail panel for a friend
  function openFriendDetail(friend) {
    setFriendDetail(friend);
    setPanelOpen(false);

    // Zooms in slightly when a friend is selected
    setTransform({
      scale: 2.4,
      x: -330,
      y: -90,
    });
  }

  // Closes the friend detail panel and resets the map
  function closeFriendDetail() {
    setFriendDetail(null);
    setTransform({ scale: 1, x: 0, y: 0 });
  }

  // Prevents the whole app from bouncing/scrolling while using the map
  useEffect(() => {
    function blockScroll(e) {
      if (e.target.closest(".friends-list")) return;
      e.preventDefault();
    }

    document.addEventListener("touchmove", blockScroll, { passive: false });

    return () => document.removeEventListener("touchmove", blockScroll);
  }, []);

  // Handles touch zoom, pinch, and wheel zoom
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let lastTouches = null;

    function dist(t1, t2) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function mid(t1, t2) {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }

    function handleTouchStart(e) {
      e.preventDefault();
      lastTouches = Array.from(e.touches);
    }

    function handleTouchMove(e) {
      e.preventDefault();
      if (!lastTouches) return;

      const touches = Array.from(e.touches);

      // One finger = drag map, only when zoomed in
      if (touches.length === 1 && lastTouches.length === 1) {
        const dx = touches[0].clientX - lastTouches[0].clientX;
        const dy = touches[0].clientY - lastTouches[0].clientY;

        setTransform((prev) => {
          if (prev.scale <= 1) return prev;
          return { ...prev, x: prev.x + dx, y: prev.y + dy };
        });
      }

      // Two fingers = pinch zoom
      if (touches.length === 2) {
        const rect = el.getBoundingClientRect();
        const newMid = mid(touches[0], touches[1]);
        const newDist = dist(touches[0], touches[1]);

        setTransform((prev) => {
          let nextScale = prev.scale;
          let nextX = prev.x;
          let nextY = prev.y;

          if (lastTouches.length === 2) {
            const prevMid = mid(lastTouches[0], lastTouches[1]);
            const prevDist = dist(lastTouches[0], lastTouches[1]);

            const zoomFactor = prevDist > 0 ? newDist / prevDist : 1;
            nextScale = Math.min(Math.max(prev.scale * zoomFactor, 0.5), 6);

            const scaleChange = nextScale / prev.scale;
            const mx = newMid.x - rect.left;
            const my = newMid.y - rect.top;

            nextX = mx - (mx - prev.x) * scaleChange + (newMid.x - prevMid.x);
            nextY = my - (my - prev.y) * scaleChange + (newMid.y - prevMid.y);
          }

          if (nextScale <= 1) return { scale: 1, x: 0, y: 0 };

          return { scale: nextScale, x: nextX, y: nextY };
        });
      }

      lastTouches = touches;
    }

    function handleTouchEnd(e) {
      e.preventDefault();
      lastTouches = Array.from(e.touches);
    }

    // Mouse wheel zoom on desktop
    function handleWheel(e) {
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setTransform((prev) => {
        const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
        const nextScale = Math.min(Math.max(prev.scale * zoomFactor, 1), 3);
        const scaleChange = nextScale / prev.scale;

        if (nextScale === 1) {
          return { scale: 1, x: 0, y: 0 };
        }

        return {
          scale: nextScale,
          x: mouseX - (mouseX - prev.x) * scaleChange,
          y: mouseY - (mouseY - prev.y) * scaleChange,
        };
      });
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Starts desktop dragging
  function handleMouseDown(e) {
    if (transform.scale <= 1) return;

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startMapX: transform.x,
      startMapY: transform.y,
    };
  }

  // Moves map while dragging
  function handleMouseMove(e) {
    if (!dragRef.current.isDragging) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    setTransform((prev) => ({
      ...prev,
      x: dragRef.current.startMapX + deltaX,
      y: dragRef.current.startMapY + deltaY,
    }));
  }

  // Stops desktop dragging
  function handleMouseUp() {
    dragRef.current.isDragging = false;
  }

  // Shows FriendProfilePage when avatar/name was clicked
  if (selectedProfileFriend) {
    return (
      <FriendProfilePage
        friend={selectedProfileFriend}
        onBack={() => setSelectedProfileFriend(null)}
      />
    );
  }

  // Shows SendLocationPage when Send My Location is clicked
  if (showSendLocation) {
    return <SendLocationPage onBack={() => setShowSendLocation(false)} />;
  }

  // Shows InviteMeetPage when Invite to Meet is clicked
  if (showInviteMeet) {
    return (
  <InviteMeetPage
    onBack={() => setShowInviteMeet(false)}
    friends={friends}
    invitedFriend={friendDetail}
  />
);
  }

  return (
    <div className="map-page">
      <Header />

      <main className="map-area">
        <div
          className="map-zoom-area"
          ref={mapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="map-transform-layer"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            }}
          >
            <img
              src={mapImg}
              alt="Festival map"
              className="map-image"
              draggable="false"
            />

            {/* Friend pins on the map */}
            {friends.map((friend) => (
              <button
                key={friend.id}
                className="friend-map-pin"
                style={{
                  left: `${friend.x}%`,
                  top: `${friend.y}%`,
                  borderColor: friend.color,
                }}
                onClick={() => openFriendDetail(friend)}
              >
                <img src={friend.avatar} alt={friend.name} />
              </button>
            ))}
          </div>
        </div>

        {/* Left-side map buttons */}
        <div className="map-controls">
          <button className="map-round-btn" onClick={openPopup}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5" />
              <path d="M12 10.5V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="7.2" r="1.4" fill="white" />
            </svg>
          </button>

          <button className="map-round-btn" onClick={resetMapView}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M4 11.5L20 4L12.5 20L10.5 13.5L4 11.5Z" fill="white" />
            </svg>
          </button>
        </div>

        {/* Friend detail panel after clicking a pin or row */}
        {friendDetail && (
          <section className="friend-detail-panel">
            <button className="friend-detail-close" onClick={closeFriendDetail}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M6 6L20 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <path d="M20 6L6 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </button>

            {/* Clicking avatar/name opens FriendProfilePage */}
            <button
              className="friend-detail-top friend-detail-profile-btn"
              onClick={() => setSelectedProfileFriend(friendDetail)}
            >
              <img
                src={friendDetail.avatar}
                alt={friendDetail.name}
                className="friend-detail-avatar"
                style={{ borderColor: friendDetail.color }}
              />

              <div className="friend-detail-info">
                <h2 style={{ color: friendDetail.color }}>
                  {friendDetail.name.split(" ")[0].toUpperCase()}
                  <br />
                  {friendDetail.name.split(" ").slice(1).join(" ").toUpperCase()}
                </h2>

                <p>
                  <span>{friendDetail.time}</span>
                  <strong>{friendDetail.location}</strong>
                </p>
              </div>
            </button>

            <div className="friend-detail-actions">
              <button
                className="friend-action-card"
                onClick={() => setShowSendLocation(true)}
              >
                <span>
                  SEND MY
                  <br />
                  LOCATION
                </span>

                <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 11.5L20 4L12.5 20L10.5 13.5L4 11.5Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>


              <button
                className="friend-action-card"
                onClick={() => setShowInviteMeet(true)}
              >
                <span>
                  INVITE TO
                  <br />
                  MEET
                </span>

                <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="2.3" stroke="white" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </section>
        )}

        {/* Bottom friends panel */}
        {!friendDetail && (
          <section className={`friends-panel ${panelOpen ? "open" : "closed"}`}>
            <div className="panel-top">
              <button className="group-select-btn">
                BASS & BESTIES

                <svg className="group-chevron" width="18" height="12" viewBox="0 0 18 12" fill="none">
                  <path
                    d="M2 2L9 10L16 2"
                    stroke="#1B4591"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="panel-toggle-btn"
                onClick={() => setPanelOpen(!panelOpen)}
              >
                {panelOpen ? (
                  <svg className="panel-close-icon" width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path d="M6 6L20 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    <path d="M20 6L6 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="panel-arrow" width="34" height="22" viewBox="0 0 34 22" fill="none">
                    <path
                      d="M5 17L17 5L29 17"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            {panelOpen && (
              <div className="friends-list">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    className="friend-row"
                    onClick={() => openFriendDetail(friend)}
                  >
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="friend-avatar"
                      style={{ borderColor: friend.color }}
                    />

                    <div className="friend-info">
                      <span
                        className="friend-name"
                        style={{ color: friend.color }}
                      >
                        {friend.name}
                      </span>

                      <p>
                        <span>{friend.time}</span>
                        <span>{friend.location}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}