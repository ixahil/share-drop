"use client";
import { pusherClient } from "@/lib/pusher";

export const usePusher = (slug: string) => {
  function subscribeToEvent<T>(event: string, handler: (data: T) => void) {
    if (!slug) return;

    const channelName = `presence-table-${slug}`;
    const channel = pusherClient.subscribe(channelName);
    channel.bind(event, handler);

    return () => {
      channel.unbind(event, handler);
      //   pusherClient.unsubscribe(channelName);
    };
  }

  return {
    tableJoinResponse: (
      handler: (data: {
        accepted: boolean;
        table: TableSession;
        peer: Peer;
      }) => void
    ) => subscribeToEvent("table:join_response", handler),
    tableJoinRequest: (handler: (data: Peer) => void) =>
      subscribeToEvent("table:join_request", handler),
  };
};
