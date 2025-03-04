"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendFileOverWebRTC } from "@/lib/fileTransfer";
import { useStore } from "@/lib/store";

const FileTransfer = () => {
  const { dataChannel } = useStore();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (dataChannel?.readyState === "open") {
      sendFileOverWebRTC(file, dataChannel);
    } else {
      // await sendFileToServer(file, table.slug);
    }
  };

  return (
    <>
      <Label htmlFor="file" className="border-2 rounded-lg p-3">
        Send File
      </Label>
      <Input
        type="file"
        id="file"
        name="file"
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
};

export default FileTransfer;
