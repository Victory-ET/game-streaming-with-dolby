import ChatWindow from "@/components/chat-window";
import VideoInterface from "@/components/video-interface";
import React from "react";

const gameStream = () => {
  return (
    <div>
      {/* Game Streaming Platform */}

      {/* Video Interface */}
      <VideoInterface />
      {/* Chat Panel */}
      <ChatWindow />
    </div>
  );
};

export default gameStream;
