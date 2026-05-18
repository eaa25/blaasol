import { useState, useRef, useEffect } from "react";

import Header from "../components/Header";
import Footer from "../components/NavBar";
import SendLocationPage from "./SendLocationPage";

import mapImg from "../assets/map.jpg";
import lauraImg from "../assets/laura.jpeg";
import sofieImg from "../assets/sofie.png";
import emmaImg from "../assets/emma.png";
import cecilieImg from "../assets/cecilie.jpeg";

import "./MapPage.css";

const friends = [
  { id: 1, name: "Laura Dahl", color: "#00B050", time: "now", location: "toilets – VIP area", avatar: lauraImg, x: 58, y: 16 },
  { id: 2, name: "Sofie Christensen", color: "#A12BCB", time: "now", location: "Byfesten", avatar: sofieImg, x: 30, y: 74 },
  { id: 3, name: "Emma Sørensen", color: "#FF5A2A", time: "5 min. ago", location: "Byfesten", avatar: emmaImg, x: 39, y: 75 },
  { id: 4, name: "Cecilie Winther", color: "#FF003D", time: "now", location: "Juice Bar", avatar: cecilieImg, x: 28, y: 62 },
];

export default function MapPage() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [friendDetail, setFriendDetail] = useState(null);
  const [showSendLocation, setShowSendLocation] = useState(false);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });

  const mapRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startMapX: 0,
    startMapY: 0,
  });

  function resetMapView() {
    setTransform({ scale: 1, x: 0, y: 0 });
    setFriendDetail(null);
  }

  function openPopup() {
    console.log("Open popup later");
  }

  function openFriendDetail(friend) {
    if (friend.name !== "Laura Dahl") return;

    setSelectedFriend(friend);
    setFriendDetail(friend);
    setPanelOpen(false);

    setTransform({
      scale: 2.4,
      x: -330,
      y: -90,
    });
  }

  function closeFriendDetail() {
    setFriendDetail(null);
    setTransform({ scale: 1, x: 0, y: 0 });
  }

  // Block browser scroll/bounce on the whole page while map is mounted.
  // Allow scrolling only inside the friends list.
  useEffect(() => {
    function blockScroll(e) {
      if (e.target.closest(".friends-list")) return;
      e.preventDefault();
    }
    document.addEventListener("touchmove", blockScroll, { passive: false });
    return () => document.removeEventListener("touchmove", blockScroll);
  }, []);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    // Cloned touch arrays so we can compare previous vs current positions
    let lastTouches = null;

    function dist(t1, t2) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function mid(t1, t2) {
      return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
    }

    function handleTouchStart(e) {
      e.preventDefault();
      lastTouches = Array.from(e.touches);
    }

    function handleTouchMove(e) {
      e.preventDefault();
      if (!lastTouches) return;

      const touches = Array.from(e.touches);

      if (touches.length === 1 && lastTouches.length === 1) {
        // Single-finger pan — only when zoomed in
        const dx = touches[0].clientX - lastTouches[0].clientX;
        const dy = touches[0].clientY - lastTouches[0].clientY;
        setTransform((prev) => {
          if (prev.scale <= 1) return prev;
          return { ...prev, x: prev.x + dx, y: prev.y + dy };
        });

      } else if (touches.length === 2) {
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

            // Scale pivoted at pinch midpoint
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

  function handleMouseUp() {
    dragRef.current.isDragging = false;
  }

  if (showSendLocation) {
    return <SendLocationPage onBack={() => setShowSendLocation(false)} />;
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
            <img src={mapImg} alt="Festival map" className="map-image" draggable="false" />

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

        {friendDetail && (
          <section className="friend-detail-panel">
            <button className="friend-detail-close" onClick={closeFriendDetail}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M6 6L20 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <path d="M20 6L6 20" stroke="white" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </button>

            <div className="friend-detail-top">
              <img
                src={friendDetail.avatar}
                alt={friendDetail.name}
                className="friend-detail-avatar"
                style={{ borderColor: friendDetail.color }}
              />

              <div className="friend-detail-info">
                <h2 style={{ color: friendDetail.color }}>
                  LAURA
                  <br />
                  DAHL
                </h2>

                <p>
                  <span>{friendDetail.time}</span>
                  <strong>{friendDetail.location}</strong>
                </p>
              </div>
            </div>

            <div className="friend-detail-actions">
              <button className="friend-action-card" onClick={() => setShowSendLocation(true)}>
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

              <button className="friend-action-card">
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

              <button className="panel-toggle-btn" onClick={() => setPanelOpen(!panelOpen)}>
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
                  <button key={friend.id} className="friend-row" onClick={() => openFriendDetail(friend)}>
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="friend-avatar"
                      style={{ borderColor: friend.color }}
                    />

                    <div className="friend-info">
                      <span className="friend-name" style={{ color: friend.color }}>
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

      <Footer active="map" />
    </div>
  );
}