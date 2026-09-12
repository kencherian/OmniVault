import { IStorageProvider } from "./types";
import { AppwriteStorageProvider } from "./AppwriteProvider";

export function getStorageProvider(): IStorageProvider {
  // In the future, we can check process.env.STORAGE_PROVIDER here
  // e.g., if (process.env.STORAGE_PROVIDER === 'minio') return new MinioStorageProvider();

  return new AppwriteStorageProvider();
}
