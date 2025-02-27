"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import axios from "axios";
import { toast } from "sonner";

function UploadPdfDailog({ children, isMaxFile }) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embedDocument = useAction(api.myActions.ingest);
  const { user } = useUser();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const onUpload = async () => {
    if (!file || !fileName.trim()) {
      toast.error("Please select a file and enter a file name.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });

      const { storageId } = await result.json();
      console.log("StorageId", storageId);

      const fileId = uuid4();
      const fileUrl = await getFileUrl({ storageId });

      // Step 3: Save file entry to the database
      await addFileEntry({
        fileId,
        storageId,
        fileName: fileName.trim(),
        fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      // Step 4: Process PDF data
      const apiResp = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`);
      console.log(apiResp.data.result);
      await embedDocument({
        splitText: apiResp.data.result,
        fileId,
      });

      toast.success("File uploaded successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} disabled={isMaxFile} className="w-full">
            + Upload PDF File
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription asChild>
              <div>
                <h2 className="mt-5">Select a file to upload</h2>
                <div className="gap-2 p-3 rounded-md border">
                  <input type="file" accept="application/pdf" onChange={onFileSelect} />
                </div>
                <div className="mt-2">
                  <label>File Name *</label>
                  <Input placeholder="File Name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild disabled={loading}>
              <Button type="button" variant="secondary" disabled={loading}>
                Close
              </Button>
            </DialogClose>
            <Button onClick={onUpload} disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadPdfDailog;
