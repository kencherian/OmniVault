import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { IStorageProvider, UploadMetadata } from "./types";

export class AppwriteStorageProvider implements IStorageProvider {
  async uploadFile(buffer: Buffer, metadata: UploadMetadata): Promise<string> {
    const { storage } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(buffer, metadata.filename);

    const uploadedFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    return uploadedFile.$id;
  }

  getFileUrl(fileId: string): string {
    return `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const { storage } = await createAdminClient();

    await storage.deleteFile(appwriteConfig.bucketId, fileId);
    return true;
  }
}
