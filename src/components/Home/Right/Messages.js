import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import { timeAndDate } from "../../../helper";

export default function Messages({ data }) {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    if (messages.length > 0) {
      // scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <>
      <div className="messages-wrapper p-2 overflow-auto">
        {messages.length > 0 ? (
          messages.map((message, key) => {
            return (
              <div
                className={`w-100 d-flex my-4 ${
                  message.senderId === currentUser.uid
                    ? "justify-content-end"
                    : ""
                }`}
                key={`_${key}`}
                ref={scrollRef}
              >
                <div
                  className={`message-box pt-1 px-3 position-relative ${
                    message.senderId === currentUser.uid
                      ? "user-message text-end text-white bg-orange"
                      : "bg-grey"
                  }`}
                >
                  <div
                    className="position-relative text-start"
                    style={{ minWidth: 100 }}
                  >
                    <span className="msg-text">
                      {message.text && message.text}
                    </span>
                  </div>
                  <span className="position-absolute bottom-0 font-14 msg-time">
                    {timeAndDate(message.date)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center w-100 h-100">
              <span>No Message</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
