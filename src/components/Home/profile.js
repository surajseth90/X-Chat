import React from "react";

export default function Profile({ profilePopupData, setProfilePopupData }) {
  return (
    <div className={`view-profile-popup position-absolute w-100 h-100 start-0 top-0 d-flex justify-content-center align-items-center ${profilePopupData !== null && "popup-open"}`}>
      <div className="view-profile-wrapper position-relative bg-whit d-flex flex-column align-items-center p-2">
        <button
          className="position-absolute close-btn"
          onClick={() => setProfilePopupData(null)}
          title="close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="m16.707,8.707l-3.293,3.293,3.293,3.293-1.414,1.414-3.293-3.293-3.293,3.293-1.414-1.414,3.293-3.293-3.293-3.293,1.414-1.414,3.293,3.293,3.293-3.293,1.414,1.414Zm7.293,3.293c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
          </svg>
        </button>

        <img
          src={profilePopupData?.photoURL}
          alt={profilePopupData?.displayName}
        />

        {/* <h2 className="mt-4">{profilePopupData.displayName.toUpperCase()}</h2> */}
      </div>
    </div>
  );
}
