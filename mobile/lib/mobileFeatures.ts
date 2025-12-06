import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Share a downloaded file using native share functionality
 */
export async function shareFile(fileUri: string, filename: string): Promise<void> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    await Sharing.shareAsync(fileUri, {
      mimeType: getMimeType(filename),
      dialogTitle: `Share ${filename}`,
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    throw error;
  }
}

/**
 * Download a file to the device's file system
 */
export async function downloadFile(
  url: string,
  filename: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const downloadDir = FileSystem.documentDirectory + 'downloads/';
    
    // Ensure download directory exists
    const dirInfo = await FileSystem.getInfoAsync(downloadDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
    }
    
    const fileUri = downloadDir + filename;
    
    // Download with progress tracking
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = 
          (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
        onProgress?.(progress);
      }
    );
    
    const result = await downloadResumable.downloadAsync();
    
    if (!result) {
      throw new Error('Download failed');
    }
    
    return result.uri;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Get file info from the file system
 */
export async function getFileInfo(fileUri: string): Promise<FileSystem.FileInfo> {
  try {
    return await FileSystem.getInfoAsync(fileUri);
  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
}

/**
 * Delete a file from the file system
 */
export async function deleteFile(fileUri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * List all downloaded files
 */
export async function listDownloadedFiles(): Promise<string[]> {
  try {
    const downloadDir = FileSystem.documentDirectory + 'downloads/';
    const dirInfo = await FileSystem.getInfoAsync(downloadDir);
    
    if (!dirInfo.exists) {
      return [];
    }
    
    return await FileSystem.readDirectoryAsync(downloadDir);
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}

/**
 * Get MIME type from filename
 */
function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
