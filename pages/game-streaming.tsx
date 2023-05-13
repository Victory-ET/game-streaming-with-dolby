import React from "react";
import ChatWindow from "@/components/chat-window";
import VideoInterface from "@/components/video-interface";
import { useRouter } from "next/router";

const GameStream = () => {
  const router = useRouter();
  const { name, role } = router.query;

  return (
    <div className="game-streaming">
      {/* Game Streaming Platform */}

      {/* Video Interface */}
      <VideoInterface />
      {/* Chat Panel */}
      <ChatWindow username={name} role={role} />
    </div>
  );
};

export default GameStream;
