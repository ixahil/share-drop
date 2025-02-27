import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY!,
  secret: process.env.PUSHER_SECRET_KEY!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,

    channelAuthorization: {
      endpoint: "/api/pusher-auth",
      transport: "ajax",
    },
  }
);
