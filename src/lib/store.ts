import { Device, Peer, Role, TableSession } from "@/types";
import { create } from "zustand";

type Store = {
  user: Peer | null;
  activeTab: number;
  table: TableSession;
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  setUser: (user: Peer) => void;
  setActiveTab: (tabNo: number) => void;
  setTable: (table: TableSession) => void;
  setPeerConnection: (pc: RTCPeerConnection) => void;
  setDataChannel: (dc: RTCDataChannel) => void;
};

const peer = {
  id: "",
  name: "",
  device: Device.COMPUTER,
  role: Role.PEER,
};

const initialTable = {
  id: "",
  name: "",
  slug: "",
  host: peer,
  activePeers: [peer],
  pendingPeers: [peer],
};

export const useStore = create<Store>()((set) => ({
  user: null,
  activeTab: 0,
  table: initialTable,
  peerConnection: null as RTCPeerConnection | null,
  dataChannel: null as RTCDataChannel | null,
  setUser: (user: Peer) => {
    set(() => ({ user: user }));
  },
  setActiveTab: (tabNo: number) => {
    set({ activeTab: tabNo });
  },
  setTable(table) {
    set({ table });
  },
  setPeerConnection: (pc: RTCPeerConnection) => set({ peerConnection: pc }),
  setDataChannel: (dc: RTCDataChannel) => set({ dataChannel: dc }),
}));
