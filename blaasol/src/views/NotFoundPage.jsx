// 404 page — shown when navigating to /404 (e.g. from the ticket icon placeholder).
// Displays a humorous message and a BACK button that returns to the home screen.

import { useNavigate } from "react-router-dom";

import thorImg from "../assets/thor404.png";

import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-statusbar" />

      <h1 className="notfound-title">OH NO!</h1>
      <p className="notfound-text">We ran out of Blå Thor again...</p>
      <p className="notfound-bold">Just joking!</p>
      <p className="notfound-text bottom">But please let us take you back to start.</p>

      <img src={thorImg} alt="Blå Thor" className="notfound-image" />

      <button className="notfound-btn" onClick={() => navigate("/")}>BACK</button>
    </div>
  );
}
