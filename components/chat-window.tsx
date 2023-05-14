import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";

// define type of data passed to the component
type ChatWindowProps = {
  username: string | string[] | undefined;
  role: string | string[] | undefined;
};
const ChatWindow = ({ username, role }: ChatWindowProps) => {
  //   pusher
  const pusher = new Pusher(process.env.NEXT_PUBLIC_APP_ID as string, {
    cluster: process.env.NEXT_PUBLIC_CLUSTER as string,
    // authentication API endpoint
    authEndpoint: "/api/auth/pushapi",
    auth: {
      params: {
        username,
      },
    },
  });

  // chat array
  const [chat, setChat] = useState<{ username: string; message: string }[]>([]);
  // message field input
  const [message, setMessage] = useState("");
  // online users  count
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  // online users
  const [usersOnline, setUsersOnline] = useState<
    { username: string; message: string }[]
  >([]);

  // subscribe users to the channel
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const channel = pusher.subscribe("presence-chat");

      // bind user to channel
      channel.bind("pusher:subscription_succeeded", (members: any) => {
        setOnlineUsersCount(members.count);
        console.log(members);
      });
      channel.bind("pusher:subscription_error", (err: any) => {
        console.log(err);
      });

      // when new users enter chat
      channel.bind("pusher:member_added", (members: any) => {
        setOnlineUsersCount(members.count);
        console.log(members);

        setUsersOnline((prev: { username: any; message: any }[]) => [
          ...prev,
          { username: members.info.username, message: "joined the chat" },
        ]);

        // to add to previous state
        setOnlineUsersCount(onlineUsersCount + 1);
      });

      channel.bind("chat-message", (data: any) => {
        const { message, username } = data;

        // update chat array and add to previous state
        setChat((prev: { username: any; message: any }[]) => [
          ...prev,
          { username, message },
        ]);
      });
    }

    return () => {
      pusher.unsubscribe("presence-chat");
      mounted = false;
    };
  }, []);

  // send message
  const sendMessage = async (e: any) => {
    e.preventDefault();
     // message API route at /api/index.tsx
    await axios.post("/api", {
      message,
      username,
    });

    setMessage("");
  };

  return (
    <div className="chat-window">
      {/* welcome user */}
      <div className="chat-window__welcome">
        <h1 className="chat-window__welcome__count">
          There are {onlineUsersCount} online
        </h1>
        {usersOnline.map((user, id) => {
          // return number of users online and notify when new members join
    
          return (
            <div key={id} className="chat-window__welcome__welcome-users">
              <div className="welcome-users">
                {" "}
                <span className="welcome-users__user">
                  {user.username}
                </span>{" "}
                just joined the chat
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {chat.map((chat: any, id: any) => {
          {/* display chat messages */}
          if (chat.username === username) {
            return (
              <div key={id}>
                <p className="chat-window__message chat-window__message--right">
                  me: {chat.message}
                </p>
              </div>
            );
          } else {
            return (
              <div key={id}>
                <p className="chat-window__message chat-window__message--left">
                  {chat.username}: {chat.message}
                </p>
              </div>
            );
          }
        })}

        {/* send messages */}
        <form className="chat-window__form" onSubmit={sendMessage}>
          <input
            className="chat-window__form__input"
            type="text"
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="chat-window__form__button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
