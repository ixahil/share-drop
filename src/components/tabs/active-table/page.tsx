"use client";
import { BiPodcast } from "react-icons/bi";
import { ActivePeers } from "./active-peers";
import ChatPanel from "./chat-panel";
import CurrentUserState from "./current-user";
import { PendingPeers } from "./pending-peers";
import TableDetails from "./table-details";

const TablePage = () => {
  return (
    <div className="container grid grid-cols-1 lg:grid-cols-6 gap-8 py-16 mx-auto h-full max-h-screen">
      {/* Left Section - Active Peers & Podcast */}
      <div className="lg:col-span-3 flex flex-col gap-8 h-full">
        {/* Active Peers */}
        <div className="flex flex-wrap gap-12 justify-center bg-white p-6">
          <ActivePeers />
        </div>

        {/* Podcast & User Info */}
        <div className="flex flex-col items-center bg-white p-6">
          <BiPodcast className="text-blue-500" size={92} />
          <p className="text-lg text-gray-700 mt-4">
            You are known as:{" "}
            <span className="font-semibold">
              <CurrentUserState />
            </span>
          </p>
        </div>
      </div>

      {/* Right Section - Table Details & Chat */}
      <div className="lg:col-span-3 bg-secondary p-6 rounded-lg space-y-8 h-full flex flex-col">
        <TableDetails />
        {/* Pending Peers */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
          <PendingPeers />
        </div>
        {/* Chat Panel */}
        <ChatPanel />
      </div>
    </div>
  );
};

export default TablePage;
