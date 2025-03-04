"use server";
import { pusherServer } from "@/lib/pusher";
import {
  Device,
  Message,
  Peer,
  Role,
  TableActionReturn,
  TableSession,
} from "@/types";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import slugify from "slugify";
import zod from "zod";

const redis = Redis.fromEnv();

const TableCreateSchema = zod.object({
  table: zod.string(),
  host: zod.string(),
  device: zod.nativeEnum(Device),
});

const TableJoinSchema = zod.object({
  table: zod.string(),
  peer: zod.string(),
  device: zod.nativeEnum(Device),
});

type TableError = {
  host?: string;
  table: string;
  peer?: string;
};

export const createTableAction = async (
  prevState: unknown,
  formData: FormData
): Promise<TableActionReturn<TableSession, TableError>> => {
  const { success, data } = TableCreateSchema.safeParse(
    Object.fromEntries(formData)
  );

  console.log(Object.fromEntries(formData));

  const prevData = {
    host: data?.host || "",
    table: data?.table || "",
  };

  if (!success) {
    return {
      error: "Validation Error",
      data: null,
      success: false,
      prevData: prevData,
    };
  }

  const slug = slugify(data.table, { lower: true });

  const password = Math.random()
    .toString(8)
    .replace(/[^a-z]+/g, "");

  const table: TableSession = {
    id: randomUUID(),
    name: data.table,
    password: password,
    slug: slug,
    host: {
      id: randomUUID(),
      device: data.device,
      name: data.host,
      role: Role.HOST,
    },
    activePeers: [],
    pendingPeers: [],
  };

  await redis.set(`table:${table.slug}`, table, { ex: 10800 });

  return {
    error: null,
    data: table,
    success: true,
    prevData: prevData,
  };
};

export const joinTableAction = async (
  prevState: unknown,
  formData: FormData
): Promise<
  TableActionReturn<{ peer: Peer; table: TableSession }, TableError>
> => {
  const { success, data } = TableJoinSchema.safeParse(
    Object.fromEntries(formData)
  );
  const prevData = {
    peer: data?.peer || "",
    table: data?.table || "",
  };

  if (!success) {
    return {
      error: "Validation Error",
      data: null,
      success: false,
      prevData: prevData,
    };
  }

  const tableSlug = slugify(data.table, { lower: true });

  const existingTable: TableSession | null = await redis.get(
    `table:${tableSlug}`
  );

  if (!existingTable) {
    return {
      error: "Table not exist",
      data: null,
      success: false,
      prevData: prevData,
    };
  }

  const newPeer: Peer = {
    device: data.device,
    id: randomUUID(),
    name: data.peer,
    role: Role.PEER,
  };

  existingTable.pendingPeers.push(newPeer);

  await redis.set(`table:${existingTable.slug}`, existingTable, { ex: 10800 });

  pusherServer.trigger(
    `presence-table-${existingTable.slug}`,
    "table:join_request",
    newPeer as Peer
  );

  return {
    error: null,
    data: { peer: newPeer, table: existingTable },
    success: true,
    prevData: prevData,
  };
};

export const getTableBySlug = async (
  slug: string
): Promise<TableSession | null> => {
  if (!slug) {
    redirect("/");
    return null;
  }

  const table = await redis.get<TableSession>(`table:${slug}`);

  return table;
};

export const updatePendingPeers = async (
  table: TableSession,
  peer: Peer,
  status: string
) => {
  const existingTable = await redis.get<TableSession>(`table:${table.slug}`);

  if (!existingTable) {
    return { error: "Table not found", accepted: false, peer };
  }

  existingTable.pendingPeers = existingTable.pendingPeers.filter(
    (p) => p.id !== peer.id
  );

  if (status === "APPROVE") {
    existingTable?.activePeers.push(peer);

    await redis.set(`table:${table.slug}`, existingTable, { ex: 10800 });

    await pusherServer.trigger(
      `presence-table-${table.slug}`,
      "table:join_response",
      {
        accepted: true,
        table: existingTable,
        peer: peer,
      }
    );
    return {
      accepted: true,
      peer: peer,
    };
  } else {
    await redis.set(`table:${table.slug}`, existingTable, { ex: 10800 });

    await pusherServer.trigger(
      `presence-table-${table.slug}`,
      "table:join_response",
      {
        accepted: false,
        table: existingTable,
        peer: peer,
      }
    );

    return {
      accepted: false,
      peer: peer,
    };
  }
};

export const sendMessageAction = async (
  tableSlug: string,
  message: Message
) => {
  console.log(message);
  // await pusherServer.trigger(
  //   `presence-table-${tableSlug}`,
  //   "table:chat-messages",
  //   message
  // );
};
