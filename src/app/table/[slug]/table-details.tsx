"use client";

import { getSlug } from "@/lib/utils";
import QRCode from "react-qr-code";
import { TableWithAll } from "./pending-peers";

type Props = {
  table: TableWithAll;
};

const TableDetails = ({ table }: Props) => {
  const peerName = getSlug("people");

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_WEBSITEURL || "https://localhost:3000";

  const qrValue = `${baseUrl}/table/waiting?slug=${table.slug}&name=${peerName}`;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xl font-bold">{table.name}</h4>
        <h4 className="text-lg font-bold text-muted-foreground">
          {table.host.name}
        </h4>
      </div>
      <QRCode size={150} className="w-full max-w-xs mx-auto" value={qrValue} />
    </div>
  );
};

export default TableDetails;
