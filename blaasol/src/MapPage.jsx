// ─────────────────────────────────────────────
// MapPage — interactive festival map
// Uses react-zoom-pan-pinch for pinch-to-zoom and drag-to-pan,
// similar to Find My on iPhone. The map fills the full screen
// between the nav bar. User can pinch, scroll, and drag freely.
// ─────────────────────────────────────────────

import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import NavBar from "./NavBar";
import mapImage from "./assets/map.jpg";
import "./MapPage.css";

export default function MapPage({ onGroupClick, onMenuClick }) {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="map-page">
      <div className="map-container">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={6}
          centerOnInit
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
        >
          {({ resetTransform }) => (
            <>
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%" }}
              >
                <img src={mapImage} alt="Festival map" className="map-image" />
              </TransformComponent>

              {/* Reset button — tapping centres and resets zoom */}
              <button className="map-reset-btn" onClick={() => resetTransform()} aria-label="Reset map">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#1B4591" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="#1B4591"/>
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="#1B4591" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </>
          )}
        </TransformWrapper>
      </div>

      <NavBar active={activeTab} onTabChange={setActiveTab} onGroupClick={onGroupClick} onMenuClick={onMenuClick} />
    </div>
  );
}
