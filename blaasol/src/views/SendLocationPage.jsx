import { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/NavBar";

import lauraImg from "../assets/laura.jpeg";
import emmaImg from "../assets/emma.png";
import sofieImg from "../assets/sofie.png";
import andreasImg from "../assets/andreas.png";
import frederikImg from "../assets/frederik.png";
import claraImg from "../assets/clara.png";
import cecilieImg from "../assets/cecilie.jpeg";

import "./SendLocationPage.css";

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
  const [selectedIds, setSelectedIds] = useState([1]);
  const [showPopup, setShowPopup] = useState(false);
  const [animatePopup, setAnimatePopup] = useState(false);

  function toggleFriend(id) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  }

  function handleSend() {
    setShowPopup(true);

    setTimeout(() => {
      setAnimatePopup(true);
    }, 900);

    setTimeout(() => {
      setShowPopup(false);
      setAnimatePopup(false);
    }, 1300);
  }

  return (
    <div className="send-location-page">
      <Header variant="back" onBackClick={onBack} />

      <main className="send-location-main">
        <section className="send-location-intro">
          <h1>SEND MY LOCATION</h1>

          <p>
            Let your friends know where you are right now.
            <br />
            Choose who you want to share your location with.
          </p>
        </section>

        <section className="send-friends-list">
          {friends.map((friend) => {
            const selected = selectedIds.includes(friend.id);

            return (
              <button
                key={friend.id}
                className={`send-friend-row ${selected ? "selected" : ""}`}
                onClick={() => toggleFriend(friend.id)}
                type="button"
              >
                <img src={friend.avatar} alt={friend.name} />

                <span>{friend.name}</span>

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
                    fill={selected ? "currentColor" : "none"}
                  />
                </svg>
              </button>
            );
          })}
        </section>

        <button
          className="send-fixed-btn"
          onClick={handleSend}
          type="button"
        >
          SEND
        </button>
      </main>

      {showPopup && (
        <div
          className={`location-popup-overlay ${
            animatePopup ? "popup-fade-out" : ""
          }`}
        >
          <div className="location-popup">
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

            <h2>LOCATION SENT SUCCESSFULLY</h2>
          </div>
        </div>
      )}

      <Footer active="map" />
    </div>
  );
}