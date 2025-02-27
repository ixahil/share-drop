"use client";

import { Table, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
// import ApproveCancelButton from "./update-join";
import { updatePendingPeers } from "@/app/action";
import { LoadingButton } from "@/components/ui/loading-button";
import { pusherClient } from "@/lib/pusher";
import { iconMap } from "@/lib/utils";

export interface TableWithAll extends Table {
  activePeers: User[];
  pendingPeers: User[];
  host: User;
}

type Props = {
  table: TableWithAll;
};

export const PendingPeers = ({ table }: Props) => {
  const [peers, setPeers] = useState(table.pendingPeers || []);
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  useEffect(() => {
    function handleRequest(peer: User) {
      setPeers((prev) => [...prev, peer]);
    }

    const channelName = `presence-table-${table.slug}`;

    const channel = pusherClient.subscribe(channelName);

    channel.bind("table:join_request", handleRequest);

    return () => {
      channel.unbind("table:join_request", handleRequest);
    };
  }, [table]);

  const pendingPeerAction = async (
    peer: User,
    status: "APPROVE" | "DECLINE"
  ) => {
    const { accepted } = await updatePendingPeers(table, peer, status);

    if (accepted || !accepted) {
      setPeers((prev) => prev.filter((p) => p.id !== peer.id));
    }
  };

  if (currentUser?.id !== table.host.id) {
    return null;
  }

  return (
    <div className="lg:grid grid-cols-2 gap-4 flex flex-col">
      {peers.map((peer) => {
        const Icon = iconMap(peer.device);
        return (
          <div
            key={peer.id}
            className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow-sm"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-blue-500 flex items-center justify-center">
                <Icon size={24} color="white" />
              </div>
              <p className="font-semibold text-xs">{peer.name}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pl-2">
              <LoadingButton
                onClick={() => pendingPeerAction(peer, "APPROVE")}
                className="bg-transparent hover:bg-white text-white px-2 py-2 rounded-md"
              >
                <MdAdd color="black" />
              </LoadingButton>
              <LoadingButton
                onClick={() => pendingPeerAction(peer, "DECLINE")}
                className="bg-transparent hover:bg-white text-white px-2 py-2 rounded-md"
                variant="outline"
              >
                <MdDelete color="red" />
              </LoadingButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
