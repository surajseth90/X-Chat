import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { ChatContext } from "../../../context/ChatContext";
import { db } from "../../../firebase";
import ChatList from "./ChatList";

export default function Left({
  currentUser,
  setSnakeBarContent,
  setProfilePopupData,
}) {
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chats, setChats] = useState({});
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      getChats();
    }
  }, [currentUser]);

  const getChats = () => {
    onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data());
    });
  };

  const handleSearch = async (str) => {
    if (str.length === 0) {
      setSearchLoading(false);
      setSearchResult([]);
      return;
    }
    let lowerCaseStr = str.toLowerCase();
    let arr = [];
    try {
      const usersList = await getDocs(collection(db, "users"));
      usersList.forEach((doc) => {
        let data = doc.data();
        if (
          data.displayName.toLowerCase().includes(lowerCaseStr) &&
          data.uid !== currentUser.uid
        )
          arr.push(doc.data());
      });
      setSearchResult(arr);
    } catch (err) {
      console.log(err);
    } finally {
      setSearchLoading(false);
    }

    console.log("arr", arr);
  };

  const handleSelect = async (user) => {
    setSearchString("");
    setSearchResult([]);
    dispatch({
      type: "CHANGE_USER",
      payload: user,
    });

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setSnakeBarContent("Something Went Wrong");
      setTimeout(() => {
        setSnakeBarContent("");
      }, 2000);
      console.log("err: ", err);
    }
  };

  const searchUser = (e) => {
    setSearchLoading(true);
    setSearchString(e.target.value);
    if (searchTimerRef.current !== undefined) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      handleSearch(e.target.value);
    }, 400);
  };

  return (
    <div className="left-section h-100">
      <div className="top-bar d-flex align-items-center">
        <img
          className="user-img-sm rounded-circle"
          src={currentUser.photoURL}
          alt={currentUser.userName}
        />
        <h1 className="font-18 m-0 ms-3 text-orange">
          {currentUser.displayName}
        </h1>
        <div className="dropdown ms-auto">
          <button
            className="text-orange"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg
              viewBox="0 0 24 24"
              height="24"
              width="24"
              preserveAspectRatio="xMidYMid meet"
              className=""
              version="1.1"
              x="0px"
              y="0px"
            >
              <title>menu</title>
              <path
                fill="currentColor"
                d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"
              ></path>
            </svg>
          </button>

          <ul className="dropdown-menu" style={{padding:0}} aria-labelledby="dropdownMenuButton1">
            <li>
              <button className="dropdown-item font-14" onClick={() => signOut(auth)}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="users-search-bar position-relative">
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`bg-grey d-flex users-search-form ${
            searchString.length > 0 ? "users-search-form-rounded-corner" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Search"
            className="w-100"
            value={searchString}
            onChange={searchUser}
          />
          <div type="submit" className="ms-auto">
            <svg
              viewBox="0 0 24 24"
              height="24"
              width="24"
              preserveAspectRatio="xMidYMid meet"
              className=""
              version="1.1"
              x="0px"
              y="0px"
            >
              <title>search</title>
              <path
                fill="currentColor"
                d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z"
              ></path>
            </svg>
          </div>
        </form>
        <div
          className={`search-results bg-grey position-absolute ${
            searchString.length > 0 && "open"
          }`}
        >
          {searchLoading ? (
            <div className="d-flex justify-content-center w-100 mt-3">
              <div className="loader-medium"></div>
            </div>
          ) : searchResult.length > 0 ? (
            searchResult.map((result, index) => {
              return (
                <div className="search-user" key={`search-${index}`}>
                  <button
                    className="w-100 d-flex py-3 px-2 align-items-center"
                    onClick={() => {
                      handleSelect(result);
                    }}
                  >
                    <img
                      className="rounded-circle user-img-sm"
                      src={result.photoURL}
                      alt={result.displayName}
                    />
                    <h3 className="font-18 ms-2">{result.displayName}</h3>
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center mt-3">No user found</p>
          )}
        </div>
      </div>

      <ChatList
        chats={chats}
        searchResult={searchResult}
        data={data}
        dispatch={dispatch}
        setProfilePopupData={setProfilePopupData}
      />
    </div>
  );
}
