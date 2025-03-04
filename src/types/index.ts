// type Device = "ANDROID" | "COMPUTER" | "IOS";

export enum Device {
  "ANDROID" = "ANDROID",
  "COMPUTER" = "COMPUTER",
  "IOS" = "IOS",
}
export enum Role {
  "HOST" = "IOS",
  "PEER" = "PEER",
}

export interface TableSession {
  id: string;
  name: string;
  password?: string;
  slug: string;
  host: Peer;
  activePeers: Peer[];
  pendingPeers: Peer[];
}

export interface Message {
  userId: string;
  userName: string;
  text?: string;
  file?: Blob;
}

export interface Peer {
  id: string;
  name: string;
  device: Device;
  role: Role;
}

export interface TableActionReturn<Data, ErrorData> {
  error: string | null;
  data: Data | null;
  success: boolean;
  prevData: ErrorData | null;
}
