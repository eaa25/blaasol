import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./views/Homepage";
import SchedulePage from "./views/Schedule";
import MapPage from "./views/MapPage";
import GroupsPage from "./views/GroupsPage";
import MenuPage from "./views/MenuPage";
import ProfilePage from "./views/ProfilePage";
import NotFoundPage from "./views/NotFoundPage";
import GroupSchedule from "./views/GroupSchedule";

import FestivalApp from "./components/FestivalApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<FestivalApp />} />

        <Route path="/homepage" element={<Homepage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/group-schedule" element={<GroupSchedule />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/404" element={<NotFoundPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;