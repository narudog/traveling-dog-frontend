export interface ImageUploadResponse {
  imageUrl: string;
  message: string;
}

export interface ImageMultiUploadResponse {
  imageUrls: string[];
  count: number;
  message: string;
}

export interface ImageGuideResponse {
  maxFileSize: string;
  allowedFormats: string[];
  maxFilesPerUpload: number;
  folders: string[];
}
