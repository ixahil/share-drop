import { getSlug, getUserAgent } from "@/lib/utils";
import React from "react";
import { CreateTable } from "../../create-table";
import { JoinTable } from "../../join-table";

const CreateJoinTable = () => {
  const peer = getSlug("people");
  const table = getSlug("place");
  const userAgent = getUserAgent();
  return (
    <div className="container mx-auto my-16 flex gap-8">
      <CreateTable peer={peer} table={table} userAgent={userAgent} />
      <JoinTable peer={peer} userAgent={userAgent} />
    </div>
  );
};

export default CreateJoinTable;
