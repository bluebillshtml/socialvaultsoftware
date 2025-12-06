import { DownloadJob } from './types';

/**
 * Download Manager
 * Manages concurrent downloads with queue management and progress tracking
 */
export class DownloadManager {
  private queue: DownloadJob[] = [];
  private activeDownloads: Map<string, DownloadJob> = new Map();
  private readonly maxConcurrent: number = 3;
  private progressCallbacks: Map<string, (progress: number) => void> = new Map();

  /**
   * Add a download to the queue
   */
  addDownload(job: DownloadJob): string {
    this.queue.push(job);
    this.processQueue();
    return job.id;
  }

  /**
   * Process the download queue
   */
  private processQueue(): void {
    while (this.activeDownloads.size < this.maxConcurrent && this.queue.length > 0) {
      const job = this.queue.shift();
      if (job) {
        this.startDownload(job);
      }
    }
  }

  /**
   * Start a download
   */
  private async startDownload(job: DownloadJob): Promise<void> {
    job.status = 'processing';
    this.activeDownloads.set(job.id, job);

    try {
      // Simulate download progress
      await this.simulateDownload(job);
      
      job.status = 'complete';
      job.progress = 100;
      job.completedAt = new Date();
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.activeDownloads.delete(job.id);
      this.processQueue();
    }
  }

  /**
   * Simulate download progress (placeholder for actual download logic)
   */
  private async simulateDownload(job: DownloadJob): Promise<void> {
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      job.progress = (i / steps) * 100;
      
      // Call progress callback if registered
      const callback = this.progressCallbacks.get(job.id);
      if (callback) {
        callback(job.progress);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Register a progress callback for a download
   */
  onProgress(jobId: string, callback: (progress: number) => void): void {
    this.progressCallbacks.set(jobId, callback);
  }

  /**
   * Get download status
   */
  getDownload(jobId: string): DownloadJob | undefined {
    return this.activeDownloads.get(jobId) || 
           this.queue.find(job => job.id === jobId);
  }

  /**
   * Get all active downloads
   */
  getActiveDownloads(): DownloadJob[] {
    return Array.from(this.activeDownloads.values());
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Get number of active downloads
   */
  getActiveCount(): number {
    return this.activeDownloads.size;
  }

  /**
   * Cancel a download
   */
  cancelDownload(jobId: string): boolean {
    // Remove from queue
    const queueIndex = this.queue.findIndex(job => job.id === jobId);
    if (queueIndex !== -1) {
      this.queue.splice(queueIndex, 1);
      return true;
    }

    // Cancel active download
    const activeJob = this.activeDownloads.get(jobId);
    if (activeJob) {
      activeJob.status = 'failed';
      activeJob.error = 'Cancelled by user';
      this.activeDownloads.delete(jobId);
      this.processQueue();
      return true;
    }

    return false;
  }
}

// Singleton instance
let downloadManagerInstance: DownloadManager | null = null;

/**
 * Get the singleton download manager instance
 */
export function getDownloadManager(): DownloadManager {
  if (!downloadManagerInstance) {
    downloadManagerInstance = new DownloadManager();
  }
  return downloadManagerInstance;
}
