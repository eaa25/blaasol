// Root router — maps URL paths to page components.
// The catch-all "*" redirects unknown paths back to home.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import FestivalApp   from "./views/FestivalApp";
import SchedulePage  from "./views/Schedule";
import MapPage       from "./views/MapPage";
import GroupsPage    from "./views/GroupsPage";
import MenuPage      from "./views/MenuPage";
import ProfilePage   from "./views/ProfilePage";
import NotFoundPage  from "./views/NotFoundPage";
import GroupSchedule from "./views/GroupSchedule";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<FestivalApp />} />
        <Route path="/homepage"      element={<FestivalApp />} />
        <Route path="/schedule"      element={<SchedulePage />} />
        <Route path="/group-schedule" element={<GroupSchedule />} />
        <Route path="/map"           element={<MapPage />} />
        <Route path="/groups"        element={<GroupsPage />} />
        <Route path="/menu"          element={<MenuPage />} />
        <Route path="/profile"       element={<ProfilePage />} />
        <Route path="/404"           element={<NotFoundPage />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
