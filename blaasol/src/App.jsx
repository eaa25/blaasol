import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./views/Homepage";
import Schedule from "./views/Schedule";
import MapPage from "./views/MapPage";
import GroupsPage from "./views/GroupsPage";
import MenuPage from "./views/MenuPage";
import ProfilePage from "./views/ProfilePage";

import FestivalApp from "./components/FestivalApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* start page */}
        <Route path="/" element={<FestivalApp />} />

        {/* existing app */}
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;