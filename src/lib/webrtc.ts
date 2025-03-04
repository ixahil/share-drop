import { useStore } from "@/lib/store";
import Peer from "simple-peer";
import { pusherClient } from "./pusher";
import { toast } from "sonner";

// Store active peers
const peers = new Map<string, Peer.Instance>();
let peer;

export const startPeerConnection = (peerId: string, isinitiator: boolean) => {
  // const channel = pusherClient.channel(`presence-table-${table.slug}`);
  peer = new Peer({
    initiator: isinitiator,
    trickle: false,
  });

  peer.on("signal", (data) => {
    channel.trigger("client-signal", { peerId, signalData: data });
  });

  peer.on("data", (data) => {
    console.log(data);
  });

  return peer;
};

// 📌 Start WebRTC Connection (Host sends offer)
export const startWebRTCConnection = (peerId: string) => {
  const { table } = useStore.getState();

  const peer = new Peer({ initiator: true, trickle: false });
  peers.set(peerId, peer);
  console.log("in start web RTC", peerId);

  peer.on("signal", (offer) => {
    pusherClient
      .channel(`presence-table-${table.slug}`)
      .trigger("client-webrtc-offer", { peerId, offer });
  });

  peer.on("icecandidate", (candidate) => {
    pusherClient
      .channel(`presence-table-${table.slug}`)
      .trigger("client-webrtc-ice", { peerId, candidate });
  });
};

// 📌 Listen for WebRTC Offers (Peer receives offer, sends answer)
export const listenForWebRTCOffer = () => {
  const { table } = useStore.getState();

  pusherClient
    .channel(`presence-table-${table.slug}`)
    .bind("client-webrtc-offer", ({ peerId, offer }) => {
      console.log("in Listen for WebRTC", peerId, offer);
      const peer = new Peer({ initiator: false, trickle: false });
      peers.set(peerId, peer);

      peer.signal(offer);

      peer.on("signal", (answer) => {
        pusherClient
          .channel(`presence-table-${table.slug}`)
          .trigger("client-webrtc-answer", { peerId, answer });
      });

      peer.on("icecandidate", (candidate) => {
        pusherClient
          .channel(`presence-table-${table.slug}`)
          .trigger("client-webrtc-ice", { peerId, candidate });
      });

      peer.addListener("connectionstatechange", () => {
        console.log("WebRTC State:", peer.connected);
      });
    });
};

// 📌 Exchange ICE Candidates
export const listenForICECandidates = () => {
  const { table } = useStore.getState();
  console.log("in listen for Ice");

  pusherClient
    .channel(`presence-table-${table.slug}`)
    .bind("client-webrtc-ice", ({ peerId, candidate }) => {
      const peer = peers.get(peerId);
      if (peer) peer.signal(candidate);
    });
};

const sendFile = (peerId: string, file: File) => {
  const peer = peers.get(peerId);
  if (!peer) return;

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = () => {
    peer.send(reader.result);
    toast.success("File sent successfully!");
  };
};

// export const startWebRTCConnection2 = async (peerId: string) => {
//   const { peerConnection, table, setDataChannel } = useStore.getState();
//   if (!peerConnection) return;

//   // Create Data Channels
//   const dataChannel = peerConnection.createDataChannel("fileTransfer");
//   setDataChannel(dataChannel);

//   dataChannel.onopen = () => console.log("Data channel opened!");
//   dataChannel.onmessage = (event) => console.log("Received:", event.data);

//   // Create and send offer
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);

//   const channel = pusherClient.channel(`presence-table-${table.slug}`);
//   channel.trigger("client-offer", { targetPeerId: peerId, offer });
// };
// export const listenForWebRTCOffer2 = () => {
//   const { peerConnection, table, user } = useStore.getState();
//   if (!peerConnection) return;

//   pusherClient
//     .channel(`presence-table-${table.slug}`)
//     .bind("client-offer", async (data) => {
//       if (data.targetPeerId !== user?.id) return; // Only process if it's for you

//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.offer)
//       );

//       // Create and send an answer
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);

//       pusherClient
//         .channel(`presence-table-${table.slug}`)
//         .trigger("client-answer", {
//           senderPeerId: user?.id, // You (answer sender)
//           targetPeerId: data.senderPeerId, // The peer who sent the offer
//           answer,
//         });
//     });
// };

// export const sendICECandidates2 = () => {
//   const { peerConnection, table } = useStore.getState();
//   if (!peerConnection) return;

//   peerConnection.onicecandidate = (event) => {
//     if (event.candidate) {
//       const channel = pusherClient.channel(`presence-table-${table.slug}`);
//       channel.trigger("client-ice-candidate", {
//         candidate: event.candidate,
//       });
//     }
//   };
// };

// export const listenForICECandidates2 = () => {
//   const { peerConnection, table } = useStore.getState();
//   if (!peerConnection) return;

//   const channel = pusherClient.channel(`presence-table-${table.slug}`);

//   channel.bind("client-ice-candidate", async (data) => {
//     if (data.candidate) {
//       await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
//     }
//   });
// };

// const acceptUser = () => {
//   const { table } = useStore();
//   const peer = new Peer({
//     initiator: false,
//     trickle: false,
//   });

//   // peerRef.current = peer;
//   // userDetails.setpeerState(peer);
//   peer.on("signal", (data) => {
//     const channel = pusherClient.channel(`presence-table-${table.slug}`);
//     channel.emit("accept-signal", {
//       signalData: data,
//       to: 123,
//     });
//     // setcurrentConnection(true);
//     // setacceptCaller(false);
//     // setterminateCall(true);
//     // toast.success(`Successful connection with ${partnerId}`);
//   });

//   peer.on("data", (data) => {
//     const parsedData = JSON.parse(data);

//     console.log("peer data", data);

//     // if (parsedData.chunk) {
//     //   setfileReceiving(true);
//     //   handleReceivingData(parsedData.chunk);
//     // } else if (parsedData.done) {
//     //   handleReceivingData(parsedData);
//     //   toast.success("File received successfully");
//     // } else if (parsedData.info) {
//     //   handleReceivingData(parsedData);
//     // }
//   });

//   peer.signal(signalingData.signalData);

//   peer.on("close", () => {
//     setpartnerId("");
//     setcurrentConnection(false);
//     toast.error(`${partnerId} disconnected`);
//     setfileUpload(false);
//     setterminateCall(false);
//     setpartnerId("");
//     userDetails.setpeerState(undefined);
//   });

//   peer.on("error", (err) => {
//     console.log(err);
//   });
// };
