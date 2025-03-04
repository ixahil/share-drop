"use client";

import { usePusher } from "@/components/hooks/usePusher";
import { useStore } from "@/lib/store";
import { iconMap } from "@/lib/utils";
import {
  listenForICECandidates,
  listenForWebRTCOffer,
  startWebRTCConnection,
} from "@/lib/webrtc";
import { Peer, TableSession } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ActivePeers = () => {
  const { user, table, peerConnection } = useStore();
  const [peers, setPeers] = useState(table.activePeers || []);

  const { tableJoinResponse } = usePusher(table.slug);

  useEffect(() => {
    function handleResponse(data: {
      accepted: boolean;
      table: TableSession;
      peer: Peer;
    }) {
      if (data.accepted) {
        setPeers((p) => [...p, data.peer]);
        toast.success(` ${data.peer.name} joined the table `);
        startWebRTCConnection(data.peer.id);
        // Listen for WebRTC responses
        listenForWebRTCOffer();
        listenForICECandidates();
      } else {
        toast.success(` ${data.peer.name} Declined`);
      }
    }

    const cleanup = tableJoinResponse(handleResponse);

    return cleanup;
  }, [table, tableJoinResponse]);

  return (
    <>
      {peers.map((u) => {
        if (u.id === user?.id) return null;

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
