import { useContext, useState } from "react";
import Left from "./Left/left";
import Right from "./Right/right";
import "./style.scss";
import { AuthContext } from "../../context/AuthContext";
import Profile from "./profile";

export default function Home({ setSnakeBarContent }) {
  const { currentUser } = useContext(AuthContext);
  const [profilePopupData, setProfilePopupData] = useState(null);
  return (
    <main className="home-page">
      <div className="container p-0 full-page overflow-hidden">
        <div className="inner-container bg-white w-100 h-100 d-flex">
          <Left
            currentUser={currentUser}
            setSnakeBarContent={setSnakeBarContent}
            setProfilePopupData={setProfilePopupData}
          />
          <Right
            currentUser={currentUser}
            setProfilePopupData={setProfilePopupData}
          />
        </div>

        <Profile
          setProfilePopupData={setProfilePopupData}
          profilePopupData={profilePopupData}
        />
        {profilePopupData != null && <div className="overlay"></div>}
      </div>
    </main>
  );
}
