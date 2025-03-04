"use client";
import { joinTableAction } from "@/app/action";
import { pusherClient } from "@/lib/pusher";
import { getUserAgent } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { toast } from "sonner";

export const WaitingComponent = () => {
  const [text, setText] = useState("Waiting for host to accept");
  const searchParams = useSearchParams();

  const slug = searchParams?.get("slug");
  const name = searchParams?.get("name");

  const router = useRouter();

  useEffect(() => {
    async function joinTable() {
      if (slug && name) {
        const formData = new FormData();

        formData.append("table", slug);
        formData.append("peer", name);
        formData.append("device", getUserAgent());

        await joinTableAction(null, formData);
      }
    }
    joinTable();
  }, [name, slug]);

  useEffect(() => {
    function handleResponse(data: { accepted: boolean }) {
      if (data.accepted) {
        setText("Host Accepeted the request not redirecting you to the table");
        toast("Host Accepeted the request not redirecting you to the table");
        setTimeout(() => {
          router.push(`/table/${slug}`);
        }, 200);
      } else {
        toast.error("Request Declined by host");
      }
    }

    const channelName = `presence-table-${slug}`;

    const channel = pusherClient.subscribe(channelName);

    channel.bind("table:join_response", handleResponse);

    return () => {
      channel.unbind("table:join_response", handleResponse);
    };
  }, [router, slug]);

  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-2">
      <BiLoader size={62} className="animate-spin" />
      <p className="text-gray-500 text-xl font-medium">{text}</p>
    </div>
  );
};
