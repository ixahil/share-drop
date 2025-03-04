"use client";
import { createTableAction } from "@/app/action";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { InputWithLabel } from "./ui/input-with-label";
import { LoadingButton } from "./ui/loading-button";
import { Device, Peer, TableSession } from "@/types";

type Props = {
  peer: string;
  table: string;
  userAgent: Device;
};

export const CreateTable = ({ peer, table, userAgent }: Props) => {
  const router = useRouter();
  const [createState, createActionCallback, isCreating] = useActionState(
    createTableAction,
    null
  );
  const { setUser, setActiveTab, setTable } = useStore();

  // Create New Table Effect
  useEffect(() => {
    if (createState?.success) {
      setUser(createState.data?.host as Peer);
      setActiveTab(1);
      setTable(createState.data as TableSession);
    } else if (createState?.error) {
      toast.error(createState.error);
    }
  }, [createState, router, setUser, setActiveTab, setTable]);
  return (
    <form action={createActionCallback} className="space-y-4 w-full">
      <InputWithLabel
        name="host"
        disabled={true}
        label="Host Name"
        id="host"
        defaultValue={createState?.prevData?.host || peer}
      />
      <InputWithLabel
        name="table"
        disabled={true}
        label="Table Name"
        id="host-table"
        defaultValue={createState?.prevData?.table || table}
      />
      <input hidden name="device" defaultValue={userAgent} />

      <LoadingButton isLoading={isCreating}>Create Table</LoadingButton>
      {createState?.error && <div className="mt-2">{createState.error}</div>}
    </form>
  );
};
