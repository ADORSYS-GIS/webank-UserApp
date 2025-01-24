export async function performProofOfWork(
  initiationNonce: string,
  devicePub: string,
  difficulty: number,
): Promise<{ powHash: string; powNonce: number }> {
  return new Promise((resolve, reject) => {
    // Initialize the worker
    const worker = new Worker(new URL("./powWorker.ts", import.meta.url));

    // Send data to the worker
    worker.postMessage({ initiationNonce, devicePub, difficulty });

    // Handle messages from the worker
    worker.onmessage = (e: MessageEvent) => {
      const { powHash, powNonce, progress } = e.data;

      // Log progress updates
      if (progress) {
        console.log(`Worker progress: ${progress} attempts`);
      }

      // Resolve if the result is ready
      if (powHash && powNonce !== undefined) {
        worker.terminate(); // Stop the worker
        resolve({ powHash, powNonce });
      }
    };

    // Handle errors from the worker
    worker.onerror = (err) => {
      worker.terminate(); // Stop the worker
      reject(err);
    };
  });
}
