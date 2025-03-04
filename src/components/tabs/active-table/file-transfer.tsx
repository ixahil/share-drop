"use client";
import { useStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { sendFileOverWebRTC, sendFileToServer } from "@/lib/fileTransfer";

const FileTransfer = () => {
  const { dataChannel, table } = useStore();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (dataChannel?.readyState === "open") {
      sendFileOverWebRTC(file, dataChannel);
    } else {
      await sendFileToServer(file, table.slug);
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
