import { useEffect, useState } from "react";

import Header from "./Header";
import NavBar from "./NavBar";

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
      <div className="festival-page">
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
    <div className="festival-page">
      <Header />

      <main className="festival-main">
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
      </main>

      <NavBar />
    </div>
  );
}

export default FestivalApp;