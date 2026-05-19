import { useEffect, useState } from "react";

import landingImg from "../images/first.png";

import artist1 from "../images/anastasia.png";
import artist2 from "../images/benjaminhav.png";

import news1 from "../images/jointsong.png";
import news2 from "../images/spotyourself.png";

import "./FestivalApp.css";

function FestivalApp() {
  const [started, setStarted] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-06-06T10:00:00");

    const interval = setInterval(() => {
      const now = new Date();

      const difference = targetDate - now;

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!started) {
    return (
      <div className="phone-frame">
        <div className="landing" onClick={() => setStarted(true)}>
          <img
            src={landingImg}
            alt="Landing"
            className="landing-image"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="phone-frame">
      <div className="app">
        {/* TOPBAR */}

        <header className="topbar">
          <button className="circle-btn">☰</button>

          <div className="logo">
            <h1>BLÅ SOL</h1>
            <p>6. JUNI 2026</p>
          </div>

          <button className="circle-btn">👤</button>
        </header>

        {/* COUNTDOWN */}

        <section className="countdown-box">
          <h2>BLÅ SOL 2026</h2>

          <div className="countdown">
            <div>
              <span>{timeLeft.days}</span>
              <p>DAGE</p>
            </div>

            <div>
              <span>{timeLeft.hours}</span>
              <p>TIMER</p>
            </div>

            <div>
              <span>{timeLeft.minutes}</span>
              <p>MINUTTER</p>
            </div>

            <div>
              <span>{timeLeft.seconds}</span>
              <p>SEKUNDER</p>
            </div>
          </div>
        </section>

        {/* ARTISTS */}

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

        {/* NEWS */}

        <section className="section">
          <h2>NEWS</h2>

          <div className="horizontal-scroll">
            <div className="card">
              <img src={news1} alt="" />
              <h3>Joint song on BLÅ SOL</h3>
            </div>

            <div className="card">
              <img src={news2} alt="" />
              <h3>Spot yourself</h3>
            </div>
          </div>
        </section>

        {/* BOTTOM NAV */}

        <nav className="bottom-nav">
          <div>Start</div>
          <div>Schedule</div>
          <div>Map</div>
          <div>Group</div>
          <div>Menu</div>
        </nav>
      </div>
    </div>
  );
}

export default FestivalApp;