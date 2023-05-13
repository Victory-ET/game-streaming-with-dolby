import { NextApiRequest, NextApiResponse } from "next";
import { pusher } from "../../../lib/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { socket_id, username, channel_name } = req.body;
  //    unique random user id
  const rand_string = Math.random().toString(36).slice(2);

  //   capture user data
  const presenceData = {
    user_id: rand_string,
    user_info: {
      username,
    },
  };

  console.log("authenticate", req.body)

  // authenticate user
  try {
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    console.log(auth);
    res.send(auth);
  } catch (err) {
    console.log(err);
    res.status(403).send("Forbidden");
  }
}
