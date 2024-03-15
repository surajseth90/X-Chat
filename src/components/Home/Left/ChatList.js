import { timeAndDate } from "../../../helper";

export default function ChatList({ chats, searchResult, dispatch, data,setProfilePopupData }) {
  return (
    <div className="users-list">
      <ul className="mt-4">
        {Object.entries(chats).length > 0 ? (
          Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map((chat) => {
              return (
                <li
                  key={chat[0]}
                  className={`user-outer-wrapper w-100 my- px-3 ${
                    chat[0] === data.chatId ? "bg-grey selected-user" : ""
                  }`}
                  style={{
                    pointerEvents: searchResult.length > 0 ? "none" : "",
                  }}
                >
                  <button
                    onClick={() => {
                      dispatch({
                        type: "CHANGE_USER",
                        payload: chat[1].userInfo,
                      });
                    }}
                    className="user-inner-wrapper pt-2 d-flex align-items-start overflow-hiden justify-content-between w-100"
                  >
                    <img
                      className="user-img-sm rounded-circle"
                      src={chat[1].userInfo.photoURL}
                      alt={chat[1].userInfo.displayName}
                      onClick={(e)=>{
                        e.stopPropagation()
                        setProfilePopupData(chat[1].userInfo)}}
                    />
                    <div className="ms-2 w-75">
                      <div className="name-last-msg d-flex justify-content-between">
                        <h3 className="font-18 m-0">
                          {chat[1].userInfo.displayName}
                        </h3>
                        <span className="ms-2">{timeAndDate(chat[1].date)}</span>
                      </div>

                      <p className="last-msg">
                        {chat[1].lastMessage?.text.length > 0 &&
                          chat[1].lastMessage?.text}
                      </p>
                    </div>
                  </button>

                  {/* <div className="line w-100 mt-2"></div> */}
                </li>
              );
            })
        ) : (
          <div className="text-center">No Conversation Yet</div>
        )}
      </ul>
    </div>
  );
}
