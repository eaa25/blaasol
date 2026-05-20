// ─────────────────────────────────────────────
// SendLocationPage
// Lets the user choose friends and send their
// current location to them.
//
// Features:
// - Select/unselect friends
// - Animated confirmation popup
// - Automatically returns to MapPage after send
// ─────────────────────────────────────────────

import { useEffect, useState } from "react";

// Shared top header and bottom navbar
import Header from "../components/Header";
import Footer from "../components/NavBar";

// Friend avatar images
import lauraImg from "../assets/laura.jpeg";
import emmaImg from "../assets/emma.png";
import sofieImg from "../assets/sofie.png";
import andreasImg from "../assets/andreas.png";
import frederikImg from "../assets/frederik.png";
import claraImg from "../assets/clara.png";
import cecilieImg from "../assets/cecilie.jpeg";

import "./SendLocationPage.css";

// Hardcoded friends list
// Later this could come from a database/API
const friends = [
  { id: 1, name: "Laura Dahl", avatar: lauraImg },
  { id: 2, name: "Emma Sørensen", avatar: emmaImg },
  { id: 3, name: "Sofie Christensen", avatar: sofieImg },
  { id: 4, name: "Andreas Nielsen", avatar: andreasImg },
  { id: 5, name: "Frederik Larsen", avatar: frederikImg },
  { id: 6, name: "Clara Jensen", avatar: claraImg },
  { id: 7, name: "Cecilie Winther", avatar: cecilieImg },
];

export default function SendLocationPage({ onBack }) {

  // Stores which friends are selected
  // Starts with Laura selected by default
  const [selectedIds, setSelectedIds] = useState([1]);

  // Controls visibility of confirmation popup
  const [showPopup, setShowPopup] = useState(false);

  // Adds fade-out animation class before popup closes
  const [animatePopup, setAnimatePopup] = useState(false);

  // ─────────────────────────────────────────────
  // Toggle friend selection
  // If already selected → remove
  // If not selected → add
  // ─────────────────────────────────────────────
  function toggleFriend(id) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  }

  // ─────────────────────────────────────────────
  // Send button logic
  //
  // 1. Show popup
  // 2. Start fade-out animation
  // 3. Hide popup
  // 4. Navigate back to MapPage
  // ─────────────────────────────────────────────
  function handleSend() {
    // Show popup immediately
    setShowPopup(true);

    // Start fade-out animation slightly later
    setTimeout(() => {
      setAnimatePopup(true);
    }, 900);

    // Remove popup and return to map
    setTimeout(() => {
      setShowPopup(false);
      setAnimatePopup(false);

      // Returns to MapPage
      onBack();
    }, 1300);
  }

  return (
    <div className="send-location-page">

      {/* Back button header */}
      <Header variant="back" onBackClick={onBack} />

      <main className="send-location-main">

        {/* Page intro text */}
        <section className="send-location-intro">
          <h1>SEND MY LOCATION</h1>

          <p>
            Let your friends know where you are right now.
            <br />
            Choose who you want to share your location with.
          </p>
        </section>

        {/* Friends selection list */}
        <section className="send-friends-list">

          {friends.map((friend) => {

            // Checks if this friend is selected
            const selected = selectedIds.includes(friend.id);

            return (
              <button
                key={friend.id}
                className={`send-friend-row ${selected ? "selected" : ""}`}
                onClick={() => toggleFriend(friend.id)}
                type="button"
              >

                {/* Friend avatar */}
                <img src={friend.avatar} alt={friend.name} />

                {/* Friend name */}
                <span>{friend.name}</span>

                {/* Send/location icon */}
                <svg
                  className="send-icon"
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 11.5L20 4L12.5 20L10.5 13.5L4 11.5Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"

                    // Filled when selected
                    fill={selected ? "currentColor" : "none"}
                  />
                </svg>
              </button>
            );
          })}
        </section>

        {/* Fixed send button at bottom */}
        <button
          className="send-fixed-btn"
          onClick={handleSend}
          type="button"
        >
          SEND
        </button>
      </main>

      {/* Confirmation popup */}
      {showPopup && (
        <div
          className={`location-popup-overlay ${
            animatePopup ? "popup-fade-out" : ""
          }`}
        >
          <div className="location-popup">

            {/* Animated checkmark circle */}
            <div className="location-check-circle">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5L10 17.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Popup text */}
            <h2>LOCATION SENT SUCCESSFULLY</h2>
          </div>
        </div>
      )}

      {/* Bottom navbar */}
      <Footer active="map" />
    </div>
  );
}