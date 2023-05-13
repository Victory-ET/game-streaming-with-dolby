import Pusher from "pusher";

const pusher = new Pusher({
  // appId: process.env.app_id as string,
  // key: process.env.key as string,
  // secret: process.env.secret as string,
  // cluster: process.env.cluster as string,
  appId: "1593503",
  key: "93611100d62ff293233c",
  secret: "349da1e31a8d9b4a74b9",
  cluster: "mt1",
  useTLS: true,
});

export { pusher };
