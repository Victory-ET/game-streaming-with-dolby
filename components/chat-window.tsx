import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { log } from "console";

type ChatWindowProps = {
  username: string | string[] | undefined;
  role: string | string[] | undefined;
};
const ChatWindow = ({ username, role }: ChatWindowProps) => {
  //   pusher
  // const pusher = new Pusher(process.env.key as string, {
  const pusher = new Pusher("93611100d62ff293233c", {
    // cluster: process.env.cluster as string,
    // cluster: process.env.cluster as string,
    cluster: "mt1",
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
  const [usersOnline, setUsersOnline] = useState([]);

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
        

        // to add to previous state
        setOnlineUsersCount(onlineUsersCount + 1)
      });

      channel.bind("chat-message", (data: any) => {
        const { message, username } = data;

        console.log("ffff",data);
        // to add to previous state
        setChat((prev: { username: any; message: any; }[]) => [...prev, { username, message }]);
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
    await axios.post("/api", {
      message,
      username,
    });

    // setChat((prev: { username: any; message: any; }[]) => [...prev, { username, message }]);
    console.log(message, username);
  };

  return (
    <div className="chat-window">
      {/* welcome user */}
      <div className="chat-window__welcome">
        <p className="chat-window__welcome__text">
          Welcome {username} to the chat
        </p>
        {chat.map((chat: any, id: any) => {
          return (
            <div key={id}>
              <p>
                {chat.username}: {chat.message}
              </p>
            </div>
          );
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
