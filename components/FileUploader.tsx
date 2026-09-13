"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { uploadWithRetry } from "@/lib/uploadResilience";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      // Initialize the AbortController for this batch of uploads
      const controller = new AbortController();
      setAbortController(controller);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            className: "error-toast",
          });
        }

        try {
          // Wrapped server action with resilient exponential backoff utility
          const uploadedFile = await uploadWithRetry(
            () => uploadFile({ file, ownerId, accountId, path }),
            3, // Max retries
            1000, // Base delay in ms
            controller.signal
          );

          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            );
          }
        } catch (error: any) {
          if (error.message === "Upload aborted by user") {
            console.log(`User cancelled the upload for ${file.name}.`);
          } else {
            console.error(error);
            toast({
              description: (
                <p className="body-2 text-white">
                  Failed to upload{" "}
                  <span className="font-semibold">{file.name}</span>.
                </p>
              ),
              className: "error-toast",
            });
          }
          // Remove the failed/aborted file from the preview list
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );
        }
      });

      await Promise.all(uploadPromises);
      setAbortController(null);
    },
    [ownerId, accountId, path, toast]
  );

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setFiles([]); // Clear pending files from UI
    }
  };

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== fileName));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <div className="flex items-center justify-between pb-2">
            <h4 className="h4 text-light-100">Uploading</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Cancel All
            </Button>
          </div>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
