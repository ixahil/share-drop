"use client";
import { joinTableAction } from "@/app/action";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { usePusher } from "./hooks/usePusher";
import { InputWithLabel } from "./ui/input-with-label";
import { LoadingButton } from "./ui/loading-button";
import { Device, Peer, TableSession } from "@/types";

type Props = {
  peer: string;
  userAgent: Device;
};

export const JoinTable = ({ peer, userAgent }: Props) => {
  const [joinState, joinActionCallback, isJoining] = useActionState(
    joinTableAction,
    null
  );
  const [joinLoading, setJoinLoading] = useState({ state: false, text: "" });

  const { setActiveTab, setTable, setUser, table } = useStore();

  const { tableJoinResponse } = usePusher(table?.slug as string);
  const router = useRouter();

  // Join Table Action Effect
  useEffect(() => {
    if (joinState?.success) {
      setTable(joinState.data?.table as TableSession);
      setUser(joinState.data?.peer as Peer);
      setJoinLoading({
        state: true,
        text: "Please Wait for the host to accept your request",
      });
    } else if (joinState?.error) {
      toast.error(joinState.error);
    }
  }, [joinState, router, setTable, setUser]);

  // Join Table Response Effect
  useEffect(() => {
    function handleResponse(data: {
      accepted: boolean;
      table: TableSession;
      peer: Peer;
    }) {
      if (data.accepted) {
        setJoinLoading({
          state: false,
          text: "Host Accepted, Redirecting you now",
        });
        toast.success("Host Accepted, Redirecting you now");
        setTimeout(() => {
          setActiveTab(1);
        }, 500);
      } else {
        toast.error("Request Declined by host");
        setJoinLoading({ state: false, text: "" });
      }
    }

    const cleanup = tableJoinResponse(handleResponse);

    return cleanup;
  }, [router, tableJoinResponse, setActiveTab]);
  return (
    <form action={joinActionCallback} className="space-y-4 w-full">
      <InputWithLabel
        name="peer"
        disabled={true}
        label="Peer Name"
        id="peer"
        defaultValue={joinState?.prevData?.peer || peer}
      />
      <InputWithLabel
        name="table"
        label="Table Name"
        id="peer-table"
        defaultValue={joinState?.prevData?.table}
      />
      <input hidden name="device" defaultValue={userAgent} />

      <LoadingButton disabled={joinLoading.state} isLoading={isJoining}>
        Join Table
      </LoadingButton>
      {joinLoading.state && (
        <div className="text-secondary-foreground">{joinLoading.text}</div>
      )}
    </form>
  );
};
