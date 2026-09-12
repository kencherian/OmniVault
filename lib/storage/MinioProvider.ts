import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { IStorageProvider, UploadMetadata } from "./types";
import { randomUUID } from "crypto";

export class MinioStorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor() {
    // These would ideally be pulled from environment variables
    this.endpoint = process.env.MINIO_ENDPOINT || "http://127.0.0.1:9000";
    this.bucket = process.env.MINIO_BUCKET_NAME || "omnivault-local";

    this.client = new S3Client({
      endpoint: this.endpoint,
      region: "us-east-1", // S3 standard, required by the SDK but arbitrary for MinIO
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "admin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "password123",
      },
      forcePathStyle: true, // Crucial for MinIO to route buckets correctly
    });
  }

  async uploadFile(buffer: Buffer, metadata: UploadMetadata): Promise<string> {
    // Generate a unique ID for the file
    const fileId = `${randomUUID()}-${metadata.filename.replace(/\s+/g, "-")}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
      Body: buffer,
      ContentType: metadata.mimeType,
    });

    await this.client.send(command);
    return fileId;
  }

  getFileUrl(fileId: string): string {
    // Returns a direct path-style URL.
    // Note: The bucket must be configured for public read access via MinIO console.
    return `${this.endpoint}/${this.bucket}/${fileId}`;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
    });

    await this.client.send(command);
    return true;
  }
}
