import { IStorageProvider } from "./types";
import { AppwriteStorageProvider } from "./AppwriteProvider";
import { MinioStorageProvider } from "./MinioProvider";

export function getStorageProvider(): IStorageProvider {
  // Toggle this via .env to instantly switch your app's entire storage infrastructure
  if (process.env.STORAGE_PROVIDER === "minio") {
    return new MinioStorageProvider();
  }

  return new AppwriteStorageProvider();
}
