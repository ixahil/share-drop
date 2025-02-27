"use server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { Device, Role, Table, User } from "@prisma/client";
import slugify from "slugify";
import zod from "zod";

const TableCreateSchema = zod.object({
  name: zod.string(),
  host: zod.string(),
});

interface TablWithAll extends Table {
  host: User;
  activePeers: User[];
  pendingPeers: User[];
}

export const createTableAction = async (
  formData: FormData,
  device: Device
): Promise<TableActionReturn<TablWithAll>> => {
  const { success, data } = TableCreateSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return {
      error: "Validation Error",
      data: null,
      success: false,
    };
  }

  const slug = slugify(data.name, { lower: true });

  const password = Math.random()
    .toString(8)
    .replace(/[^a-z]+/g, "");

  const host = await prisma.user.create({
    data: {
      name: data.host,
      role: Role.HOST,
      device: device,
    },
  });

  const table = await prisma.table.create({
    data: {
      name: data.name,
      password: password,
      slug: slug,
      host: { connect: { id: host.id } },
    },
    include: {
      host: true,
      activePeers: true,
      pendingPeers: true,
    },
  });

  // await pusherServer.trigger("presence-table-list", "table:created", table);

  // // redirect("/table/" + table.slug);

  return {
    error: null,
    data: table,
    success: true,
  };
};

export const joinTableAction = async (data: {
  tableSlug: string;
  peer: string;
  device: Device;
}): Promise<TableActionReturn<User>> => {
  if (!data.tableSlug || !data.peer) {
    return {
      error: "Validation Error",
      data: null,
      success: false,
    };
  }
  const existingTable = await prisma.table.findFirst({
    where: {
      slug: data.tableSlug,
    },
  });

  if (!existingTable) {
    return {
      error: "Table not exist",
      data: null,
      success: false,
    };
  }

  const peer = await prisma.user.create({
    data: {
      name: data.peer,
      role: "PEER",
      requestedTables: { connect: [{ slug: data.tableSlug }] },
      device: data.device,
    },
  });

  pusherServer.trigger(
    `presence-table-${data.tableSlug}`,
    "table:join_request",
    peer
  );

  return {
    error: null,
    data: peer,
    success: true,
  };
};

export const getTableBySlug = async (slug: string) => {
  return await prisma.table.findFirst({
    where: { slug },
    include: {
      pendingPeers: true,
      activePeers: true,
      host: true,
      messages: { include: { user: true, table: true } },
    },
  });
};

export const updatePendingPeers = async (
  table: TableSession,
  peer: User,
  status: string
) => {
  if (status === "APPROVE") {
    await prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        pendingPeers: { disconnect: [{ id: peer.id }] },
        activePeers: { connect: [{ id: peer.id }] },
      },
    });

    await pusherServer.trigger(
      `presence-table-${table.slug}`,
      "table:join_response",
      {
        accepted: true,
        peer: peer,
      }
    );
    return {
      accepted: false,
      peer: peer,
    };
  } else {
    await prisma.table.update({
      where: {
        id: table.id,
      },
      data: {
        pendingPeers: { disconnect: [{ id: peer.id }] },
      },
    });

    await pusherServer.trigger(
      `presence-table-${table.slug}`,
      "table:join_response",
      {
        accepted: false,
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
  userId: number,
  tableId: number,
  message: string
) => {
  const createdMessage = await prisma.message.create({
    data: {
      message: message,
      user: {
        connect: {
          id: userId,
        },
      },
      table: {
        connect: {
          id: tableId,
        },
      },
    },
    include: {
      table: true,
      user: true,
    },
  });

  if (createdMessage) {
    pusherServer.trigger(
      `presence-table-${createdMessage.table.slug}`,
      "chat:new_message",
      createdMessage
    );
  }
};
