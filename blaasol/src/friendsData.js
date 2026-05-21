// Central friends list — imported by ProfilePage, MapPage, and InviteMeetPage.
// Each friend has a unique color used for their avatar border and name text.

import lauraImg    from "./assets/laura.jpeg";
import emmaImg     from "./assets/emma.png";
import sofieImg    from "./assets/sofie.png";
import andreasImg  from "./assets/andreas.png";
import frederikImg from "./assets/frederik.png";
import cecilieImg  from "./assets/cecilie.jpeg";

export const friends = [
  { id: 1, name: "Laura Dahl",        avatar: lauraImg,    color: "#00B050" },
  { id: 2, name: "Emma Sørensen",     avatar: emmaImg,     color: "#FF5A2A" },
  { id: 3, name: "Sofie Christensen", avatar: sofieImg,    color: "#A12BCB" },
  { id: 4, name: "Andreas Nielsen",   avatar: andreasImg,  color: "#1B4591" },
  { id: 5, name: "Frederik Larsen",   avatar: frederikImg, color: "#FFACCE" },
  { id: 6, name: "Cecilie Winther",   avatar: cecilieImg,  color: "#FF003D" },
];
