import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import FestivalApp from "./components/FestivalApp";

import Schedule from "./views/Schedule";
import MapPage from "./views/MapPage";
import GroupsPage from "./views/GroupsPage";
import MenuPage from "./views/MenuPage";
import ProfilePage from "./views/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FestivalApp />} />

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