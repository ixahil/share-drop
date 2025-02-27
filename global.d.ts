interface TableSession {
  id: number;
  name: string;
  slug: string;
  host: Peer;
  password: string;
  activePeers: Peer[];
  pendingPeers: Peer[];
}

interface TableActionReturn<Data> {
  error: string | null;
  data: Data | null;
  success: boolean;
}

interface FormError {
  root?: string;
  [key?: string]: string;
}

interface Peer {
  name: string; // Assigned name
  role: "HOST" | "PEER";
}

interface Message {
  senderId: string;
  content: string;
  timestamp: number;
}

interface FileTransfer {
  senderId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileData: ArrayBuffer; // Raw binary data for transfer
}
