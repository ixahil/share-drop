import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.formData();

    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;
    const data = {
      user_id: socketId,
    };

    const authResonse = pusherServer.authorizeChannel(socketId, channel, data);

    return NextResponse.json(authResonse);
  } catch (error) {
    console.log("error", error);
  }
}
