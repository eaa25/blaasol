import gnags from "./assets/gnags.png";
import bonad from "./assets/bonad.png";
import specktors from "./assets/specktors.png";
import anastasia from "./assets/anastasia.png";
import selvglad from "./assets/selvglad.png";
import naturalbornhippies from "./assets/naturalbornhippies.png";
import zarpaulo from "./assets/zarpaulo.png";
import elakelaset from "./assets/ELÄKELÄISET.png";
import emmaImg     from "./assets/emma.png";
import frederikImg  from "./assets/frederik.png";
import claraImg     from "./assets/clara.png";
import sofieImg     from "./assets/sofie.png";

// Friends shown as circular profile photos in Group Schedule
export const FRIENDS = [
  { id: 1, name: "Emma",     img: emmaImg },
  { id: 2, name: "Frederik", img: frederikImg },
  { id: 3, name: "Clara",    img: claraImg },
  { id: 4, name: "Sofie",    img: sofieImg },
];

// friendLikes = which friend IDs have liked this act (mock data)
export const ACTS = [
  { id: 1, time: "10:00", name: "GNAGS",                venue: "Vidunderblå", img: gnags,              friendLikes: [1, 2, 3] },
  { id: 2, time: "11:20", name: "BONAD",                venue: "Dragonen",    img: bonad,              friendLikes: [1, 4] },
  { id: 3, time: "11:40", name: "SPECKTORS",            venue: "Dragonen",    img: specktors,          friendLikes: [2, 3, 4] },
  { id: 4, time: "13:15", name: "ANASTASIA",            venue: "Vidunderblå", img: anastasia,          friendLikes: [1, 3] },
  { id: 5, time: "16:00", name: "ELÄKELÄISET",          venue: "Vidunderblå", img: elakelaset,         friendLikes: [1, 2, 3, 4] },
  { id: 6, time: "16:45", name: "ZAR PAULO",            venue: "Byfesten",    img: zarpaulo,           friendLikes: [2, 4] },
  { id: 7, time: "18:00", name: "SELVGLAD",             venue: "Vidunderblå", img: selvglad,           friendLikes: [1, 3] },
  { id: 8, time: "19:30", name: "NATURAL BORN HIPPIES", venue: "Dragonen",    img: naturalbornhippies, friendLikes: [3, 4] },
];
