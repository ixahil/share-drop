"use client";

import { iconMap } from "@/lib/utils";
import { TableWithAll } from "./pending-peers";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { User } from "@prisma/client";

type Props = {
  table: TableWithAll;
};

export const ActivePeers = ({ table }: Props) => {
  const [peers, setPeers] = useState(table.activePeers || []);
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  useEffect(() => {
    function handleResponse(data: { accepted: boolean; peer: User }) {
      if (data.accepted) {
        setPeers((p) => [...p, data.peer]);
      }
    }

    const channelName = `presence-table-${table.slug}`;

    const channel = pusherClient.subscribe(channelName);

    channel.bind("table:join_response", handleResponse);

    return () => {
      channel.unbind("table:join_response", handleResponse);
    };
  }, [table]);

  return (
    <>
      {peers.map((u) => {
        if (u.id === currentUser.id) return null;

        const Icon = iconMap(u.device);

        return (
          <div
            key={u.id}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <div className="p-3 rounded-full bg-blue-500">
              <Icon color="white" size={32} />
            </div>
            <div className="text-center">
              <p className="font-bold">{u.name}</p>
              <p className="text-xs">{u.device}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};
