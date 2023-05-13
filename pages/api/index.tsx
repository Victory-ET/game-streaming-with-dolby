import { pusher } from "@/lib/pusher";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, username } = req.body;
  
  console.log("called", req.body)

  await pusher.trigger("presence-chat", "chat-message", {
    message,
    username,
  });
  res.status(200).json({ message: "Message sent" });
}
