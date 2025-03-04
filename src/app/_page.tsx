"use client";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { LoadingButton } from "@/components/ui/loading-button";
import { getSlug, getUserAgent } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createTableAction, joinTableAction } from "./action";
import slugify from "slugify";
import { pusherClient } from "@/lib/pusher";
import { Device } from "@prisma/client";

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [peerTableSlug, setPeerTableSlug] = useState<string>("");
  const router = useRouter();
  const peer_slug = getSlug("people");
  const table_slug = getSlug("place");

  async function handleCreate(formData: FormData) {
    setIsCreating(true);

    const { success, data } = await createTableAction(
      formData,
      getUserAgent()!
    );

    if (success) {
      router.push(`/table/${data?.slug}`);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: data?.host.id,
          name: peer_slug,
          device: getUserAgent(),
        })
      );
    } else {
      toast.error("Failed to create table");
    }

    setIsCreating(false);
  }

  async function handleJoin(formData: FormData) {
    const peer = {
      tableSlug: slugify(formData.get("name") as string, { lower: true }),
      peer: formData.get("peer") as string,
      device: getUserAgent() as Device,
    };

    const { success, data } = await joinTableAction(peer);

    if (!success) {
      toast.error("Table not exist!");
      return;
    }

    setPeerTableSlug(peer.tableSlug);

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: data?.id,
        name: peer_slug,
        device: getUserAgent(),
      })
    );

    setIsJoining(true);
  }

  useEffect(() => {
    function handleResponse(data: { accepted: boolean }) {
      if (data.accepted) {
        setIsJoining(false);
        router.push(`/table/${peerTableSlug}`);
      } else {
        toast.error("Request Declined by host");
        setIsJoining(false);
      }
    }

    const channelName = `presence-table-${peerTableSlug}`;

    const channel = pusherClient.subscribe(channelName);

    channel.bind("table:join_response", handleResponse);

    return () => {
      channel.unbind("table:join_response", handleResponse);
    };
  }, [router, peerTableSlug]);

  return (
    <div className="container mx-auto my-16 flex gap-8">
      <form action={handleCreate} className="space-y-4 w-full">
        <InputWithLabel
          name="host"
          disabled={true}
          label="Host Name"
          id="host"
          defaultValue={peer_slug}
        />
        <InputWithLabel
          name="name"
          disabled={true}
          label="Table Name"
          id="name"
          defaultValue={table_slug}
        />

        <LoadingButton isLoading={isCreating}>Create Table</LoadingButton>
      </form>
      <form action={handleJoin} className="space-y-4 w-full">
        <InputWithLabel
          name="peer"
          disabled={true}
          label="Peer Name"
          id="peer"
          defaultValue={peer_slug}
        />
        <InputWithLabel name="name" label="Table Name" id="name" />

        <LoadingButton isLoading={isJoining}>Join Table</LoadingButton>
        {isJoining && (
          <div className="text-secondary-foreground">
            Please Wait for the host to accept your request
          </div>
        )}
      </form>
    </div>
  );
}
