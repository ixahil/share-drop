// 1️⃣ Send file over WebRTC
export const sendFileOverWebRTC = (file: File, dataChannel: RTCDataChannel) => {
  console.log("Sending file via WebRTC...");
  const CHUNK_SIZE = 64 * 1024; // 64KB chunks
  let offset = 0;

  const sendChunk = () => {
    if (offset < file.size) {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      dataChannel.send(chunk);
      offset += CHUNK_SIZE;
      setTimeout(sendChunk, 50);
    } else {
      dataChannel.send("FILE_TRANSFER_COMPLETE");
      console.log("File transfer completed.");
    }
  };

  sendChunk();
};

// 2️⃣ Send file via server (fallback)
export const sendFileToServer = async () => {
  console.log("DataChannel not open, sending file via server...");
  // await sendMessageAction(tableSlug, { file });
};
