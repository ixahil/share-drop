"use client";
import { sendMessageAction } from "@/app/action";
import { LoadingButton } from "@/components/ui/loading-button";
import { pusherClient } from "@/lib/pusher";
import { useStore } from "@/lib/store";
import { Message } from "@/types";
import { useEffect, useState } from "react";
import FileTransfer from "./file-transfer";

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user, table } = useStore();

  useEffect(() => {
    const channel = pusherClient.subscribe(`presence-table-${table.slug}`);
    channel.bind("table:chat-messages", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // channel.bind("pusher:member_added", (data) => {
    //   console.log(data);
    // });

    return () => {
      pusherClient.unsubscribe(`presence-table-${table?.slug}`);
    };
  }, [table.slug, messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);

    const newMessage = {
      userId: user?.id || "",
      userName: user?.name || "",
      text: message,
    };

    await sendMessageAction(table.slug, newMessage);
    setMessage("");
    setIsSending(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg overflow-hidden shadow-md">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg?.userId === user?.id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg?.userId === user?.id
                  ? "bg-blue-500 text-white self-start"
                  : "bg-gray-200 self-end"
              }`}
            >
              <p className="text-sm font-semibold">{msg?.userName}</p>
              <p>{msg?.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 mt-2">
        <FileTransfer />
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder="Type your message..."
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
        />
        <LoadingButton
          isLoading={isSending}
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Send
        </LoadingButton>
      </div>
    </div>
  );
};

export default ChatPanel;
