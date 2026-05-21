// "Invite to Meet" flow — opened from the Map page friend detail panel.
// Three steps in sequence:
//   1. WHERE — pick a meeting point from categorised festival locations
//   2. WHEN  — choose a quick time (e.g. "15 mins") or set an exact time
//   3. WHO   — select which friends to invite
// After confirming, shows a brief success animation and returns to the map.

import { useState } from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import "./InviteMeetPage.css";

// All festival location categories and their options
const categories = [
  {
    id: "stages",
    label: "STAGES",
    color: "#009FDC",
    options: ["Byfesten", "Dragonen", "Piano and waterguns", "Vidunderblå"],
  },
  {
    id: "toilets",
    label: "TOILETS & WARDROBES",
    color: "#1B4591",
    options: [
      "Accessible toilets", "Birkelunden toilets", "Byfesten toilets",
      "Entrance wardrobe", "Råt & Blåt toilets", "Vidunderblå toilets", "VIP toilets & wardrobes",
    ],
  },
  {
    id: "drinks",
    label: "DRINKS",
    color: "#FF5A2A",
    options: [
      "Blå Sol Bar", "Hos Palle", "Juice Bar", "Kaffe", "Kratluskeren",
      "Pårten", "Reb Bar", "Rytterstuen", "Råt & Blåt", "Sidevognen",
      "Tanken", "Vinbar", "VIP Bar", "Ølvognen",
    ],
  },
  {
    id: "food",
    label: "FOOD",
    color: "#92278F",
    options: [
      "Arizona", "Bagle Bucks", "Himmerland", "Martin IB", "Mo'Rice",
      "Norevent", "Rulle", "SFC", "Slik & Snacks", "Smagsløg",
      "VIP Buffet", "Wokken & Kokken", "Østegade",
    ],
  },
  {
    id: "security",
    label: "SECURITY & FIRST AID",
    color: "#FF003D",
    options: ["First aid", "Medics"],
  },
  {
    id: "experiences",
    label: "EXPERIENCES",
    color: "#F9B233",
    options: ["Derby h.12.45", "Musikquiz h.15.10", "Randers Kunstmuseum"],
  },
  {
    id: "info",
    label: "INFO & PURCHASE",
    color: "#00B050",
    options: ["Merch", "Merch popup", "Natteravnene", "Press", "Ticket booth", "Tobacco"],
  },
  {
    id: "volunteers",
    label: "VOLUNTEERS",
    color: "#7A4A35",
    options: ["Blå Stue", "Volunteer area"],
  },
];

const quickTimes = ["5 mins", "10 mins", "15 mins", "30 mins", "45 mins", "1 hour"];

export default function InviteMeetPage({ onBack, friends = [], invitedFriend }) {
  // Pre-select the friend that was open when this page was triggered
  const [selectedFriends, setSelectedFriends] = useState(
    invitedFriend ? [invitedFriend.id] : []
  );

  const [step, setStep]                 = useState("where"); // "where" | "when" | "who"
  const [openCategory, setOpenCategory] = useState(null);    // which location category is expanded
  const [selectedPlace, setSelectedPlace] = useState(null);  // chosen meeting point
  const [selectedTime, setSelectedTime]   = useState(null);  // chosen time string
  const [showTimePicker, setShowTimePicker] = useState(false); // custom time picker visible

  // Custom time picker values (12-hour format)
  const [hour,   setHour]   = useState("06");
  const [minute, setMinute] = useState("28");
  const [period, setPeriod] = useState("PM");

  // Success popup after sending the invite
  const [showPopup,    setShowPopup]    = useState(false);
  const [animatePopup, setAnimatePopup] = useState(false);

  function toggleFriend(friendId) {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  }

  // Back button steps backwards through the flow
  function handleBack() {
    if (showTimePicker) { setShowTimePicker(false); return; }
    if (step === "who")  { setStep("when");          return; }
    if (step === "when") { setStep("where");          return; }
    onBack();
  }

  function handleCategoryClick(categoryId) {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  }

  // Selecting a location automatically advances to the "when" step
  function handlePlaceClick(option) {
    setSelectedPlace(option);
    setTimeout(() => setStep("when"), 150);
  }

  // Selecting a quick time automatically advances to the "who" step
  function handleQuickTime(time) {
    setSelectedTime(time);
    setStep("who");
  }

  function saveCustomTime() {
    setSelectedTime(`${hour}:${minute} ${period}`);
    setShowTimePicker(false);
    setStep("who");
  }

  // Helpers for the scroll-wheel time picker
  function changeHour(direction) {
    setHour((prev) => {
      let next = Number(prev) + direction;
      if (next > 12) next = 1;
      if (next < 1)  next = 12;
      return String(next).padStart(2, "0");
    });
  }

  function changeMinute(direction) {
    setMinute((prev) => {
      let next = Number(prev) + direction;
      if (next > 59) next = 0;
      if (next < 0)  next = 59;
      return String(next).padStart(2, "0");
    });
  }

  function getPrevHour()   { let v = Number(hour)   - 1; if (v < 1)  v = 12; return String(v).padStart(2, "0"); }
  function getNextHour()   { let v = Number(hour)   + 1; if (v > 12) v = 1;  return String(v).padStart(2, "0"); }
  function getPrevMinute() { let v = Number(minute) - 1; if (v < 0)  v = 59; return String(v).padStart(2, "0"); }
  function getNextMinute() { let v = Number(minute) + 1; if (v > 59) v = 0;  return String(v).padStart(2, "0"); }

  // Shows success animation then returns to the map
  function handleInvite() {
    setShowPopup(true);
    setTimeout(() => setAnimatePopup(true), 900);
    setTimeout(() => {
      setShowPopup(false);
      setAnimatePopup(false);
      onBack();
    }, 1300);
  }

  return (
    <div className="invite-page">
      <Header variant="back" onBackClick={handleBack} />

      <main className="invite-content">
        <h1>
          INVITE FRIENDS TO
          <br />
          MEET
        </h1>

        {step === "where" && (
          <p className="invite-intro">
            Choose a meeting point, set a time and invite your friends to meet up.
          </p>
        )}

        {/* Step 1: pick a location */}
        {step === "where" && (
          <>
            <h2>Where?</h2>
            <div className="invite-categories">
              {categories.map((category) => (
                <div className="category-row" key={category.id}>
                  {/* Category header button — tap to expand/collapse */}
                  <button
                    className="category-btn"
                    style={{ backgroundColor: category.color }}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.label}
                  </button>

                  {openCategory === category.id && (
                    <div className="option-scroll">
                      {category.options.map((option) => {
                        const isSelected = selectedPlace === option;
                        return (
                          <button
                            key={option}
                            className="option-btn"
                            style={{
                              borderColor: category.color,
                              backgroundColor: isSelected ? category.color : "transparent",
                              color: isSelected ? "white" : category.color,
                            }}
                            onClick={() => handlePlaceClick(option)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2a: quick time buttons */}
        {step === "when" && !showTimePicker && (
          <>
            <h2>When?</h2>
            <div className="quick-time-list">
              {quickTimes.map((time) => (
                <button
                  key={time}
                  className={`quick-time-btn ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => handleQuickTime(time)}
                >
                  {time}
                </button>
              ))}
              <button className="set-time-btn" onClick={() => setShowTimePicker(true)}>
                SET TIME
              </button>
            </div>
          </>
        )}

        {/* Step 3: pick which friends to invite */}
        {step === "who" && (
          <>
            <h2>Who?</h2>
            <div className="who-grid">
              {friends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.id);
                const firstName  = friend.name.split(" ")[0];
                return (
                  <button key={friend.id} className="who-friend-btn" onClick={() => toggleFriend(friend.id)}>
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="who-avatar"
                      style={{ borderColor: isSelected ? friend.color : "transparent" }}
                    />
                    <span>{firstName}</span>
                  </button>
                );
              })}
            </div>
            <button className="invite-final-btn" onClick={handleInvite}>INVITE</button>
          </>
        )}

        {/* Step 2b: custom scroll-wheel time picker */}
        {step === "when" && showTimePicker && (
          <>
            <h2>When?</h2>
            <div className="time-picker">
              <div className="picker-column" onWheel={(e) => changeHour(e.deltaY > 0 ? 1 : -1)}>
                <button className="picker-value faded" onClick={() => changeHour(-1)}>{getPrevHour()}</button>
                <button className="picker-value active">{hour}</button>
                <button className="picker-value faded" onClick={() => changeHour(1)}>{getNextHour()}</button>
              </div>

              <div className="picker-colon">:</div>

              <div className="picker-column" onWheel={(e) => changeMinute(e.deltaY > 0 ? 1 : -1)}>
                <button className="picker-value faded" onClick={() => changeMinute(-1)}>{getPrevMinute()}</button>
                <button className="picker-value active">{minute}</button>
                <button className="picker-value faded" onClick={() => changeMinute(1)}>{getNextMinute()}</button>
              </div>

              <div className="period-picker">
                <button className={`period-btn ${period === "PM" ? "active" : ""}`} onClick={() => setPeriod("PM")}>PM</button>
                <button className={`period-btn ${period === "AM" ? "active" : ""}`} onClick={() => setPeriod("AM")}>AM</button>
              </div>
            </div>

            <div className="time-actions">
              <button className="cancel-time-btn" onClick={() => setShowTimePicker(false)}>CANCEL</button>
              <button className="save-time-btn"   onClick={saveCustomTime}>SAVE</button>
            </div>
          </>
        )}
      </main>

      {/* Success popup shown after pressing INVITE */}
      {showPopup && (
        <div className={`location-popup-overlay ${animatePopup ? "popup-fade-out" : ""}`}>
          <div className="location-popup">
            <div className="location-check-circle">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5L10 17.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>INVITATION SENT SUCCESSFULLY</h2>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
}
