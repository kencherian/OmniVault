/// <reference types="node" />

export interface UploadMetadata {
  filename: string;
  mimeType: string;
  size: number;
}

export interface IStorageProvider {
  /**
   * Uploads a file buffer to the storage bucket
   * @returns The unique identifier (fileId) of the uploaded file
   */
  uploadFile(buffer: Buffer, metadata: UploadMetadata): Promise<string>;

  /**
   * Generates a view/download URL for the client
   */
  getFileUrl(fileId: string): string;

  /**
   * Deletes a file from the storage bucket
   */
  deleteFile(fileId: string): Promise<boolean>;
}
