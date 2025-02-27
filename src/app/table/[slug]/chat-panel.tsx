"use client";
import { sendMessageAction } from "@/app/action";
import { pusherClient } from "@/lib/pusher";
import { Message, Table, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { TableWithAll } from "./pending-peers";

interface MessageWithAll extends Message {
  user: User;
  table: Table;
}

type Props = {
  table: TableWithAll;
  existingMessages: MessageWithAll[];
};

const ChatPanel = ({ table, existingMessages }: Props) => {
  const [messages, setMessages] = useState<MessageWithAll[] | []>(
    existingMessages || []
  );
  const [message, setMessage] = useState("");
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  useEffect(() => {
    const channel = pusherClient.subscribe(`presence-table-${table.slug}`);

    channel.bind("chat:new_message", (newMessage: MessageWithAll) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      pusherClient.unsubscribe(`presence-table-${table.slug}`);
    };
  }, [table.slug]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await sendMessageAction(currentUser.id, table.id, message);

    setMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg overflow-hidden shadow-md">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.userId === currentUser.id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.userId === currentUser.id
                  ? "bg-blue-500 text-white self-start"
                  : "bg-gray-200 self-end"
              }`}
            >
              <p className="text-sm font-semibold">{msg.user.name}</p>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
