export async function uploadWithRetry<T>(
  uploadFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  signal?: AbortSignal
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    // Check if the user cancelled the upload before attempting
    if (signal?.aborted) {
      throw new Error("Upload aborted by user");
    }

    try {
      return await uploadFn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw new Error(
          `Upload failed after ${maxRetries} attempts. Please check your connection.`
        );
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(
        `Upload failed. Retrying in ${delay}ms... (Attempt ${attempt + 1} of ${maxRetries})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Upload failed");
}
