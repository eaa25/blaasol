// Home / start page of the app.
// First visit shows a full-screen landing image — tap anywhere to enter.
// After that, shows a live countdown to the festival, a horizontal artist
// carousel, and a news section. Navigating away and back skips the landing.

import { useEffect, useState } from "react";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import landingImg   from "../assets/images/first.png";
import countdownBg  from "../assets/images/countdownbackground.png";
import artist1      from "../assets/images/anastasia.png";
import artist2      from "../assets/images/benjaminhav.png";
import news1        from "../assets/images/jointsong.png";
import news2        from "../assets/images/spotyourself.png";

import "./FestivalApp.css";

// Module-level flag so the landing is skipped when navigating back to "/"
// within the same session, but reappears on a full page refresh.
let hasSeenLanding = false;

function FestivalApp() {
  const [started, setStarted] = useState(hasSeenLanding);

  // Countdown state — updated every second
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-06-06T10:00:00");

    const interval = setInterval(() => {
      const difference = targetDate - new Date();
      setTimeLeft({
        days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Full-screen landing — tap to enter the app
  if (!started) {
    return (
      <div className="festival-page">
        <div
          className="landing"
          onClick={() => {
            hasSeenLanding = true;
            setStarted(true);
          }}
        >
          <img src={landingImg} alt="Landing" className="landing-image" />
        </div>
      </div>
    );
  }

  return (
    <div className="festival-page">
      <Header />

      <main className="festival-main">
        {/* Live countdown to the festival opening */}
        <section
          className="countdown-box"
          style={{ backgroundImage: `url(${countdownBg})` }}
        >
          <h2>BLÅ SOL 2026</h2>
          <div className="countdown">
            <div><span>{timeLeft.days}</span>    <p>DAGE</p></div>
            <div><span>{timeLeft.hours}</span>   <p>TIMER</p></div>
            <div><span>{timeLeft.minutes}</span> <p>MINUTTER</p></div>
            <div><span>{timeLeft.seconds}</span> <p>SEKUNDER</p></div>
          </div>
        </section>

        {/* Horizontally scrollable artist cards */}
        <section className="section">
          <h2>ARTISTS</h2>
          <div className="horizontal-scroll">
            <div className="card">
              <img src={artist1} alt="" />
              <h3>ANASTASIA</h3>
            </div>
            <div className="card">
              <img src={artist2} alt="" />
              <h3>BENJAMIN HAV</h3>
            </div>
          </div>
        </section>

        {/* Latest festival news */}
        <section className="section">
          <h2>NEWS</h2>
          <div className="horizontal-scroll">
            <div className="card news-card">
              <img src={news1} alt="" />
              <h3>Joint song on BLÅ SOL</h3>
            </div>
            <div className="card news-card">
              <img src={news2} alt="" />
              <h3>Spot yourself</h3>
            </div>
          </div>
        </section>
      </main>

      <NavBar />
    </div>
  );
}

export default FestivalApp;
