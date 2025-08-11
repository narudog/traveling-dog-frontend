import { create } from "zustand";
import axios from "@/lib/axios";
import {
  ImageGuideResponse,
  ImageMultiUploadResponse,
  ImageUploadResponse,
} from "@/types/image";

interface ImageState {
  loading: boolean;
  error: string | null;
}

interface ImageActions {
  upload: (file: File, folder?: string) => Promise<ImageUploadResponse>;
  uploadMultiple: (
    files: File[],
    folder?: string
  ) => Promise<ImageMultiUploadResponse>;
  delete: (imageUrl: string) => Promise<{ message: string }>;
  guide: () => Promise<ImageGuideResponse>;
}

export const useImageStore = create<ImageState & ImageActions>((set) => ({
  loading: false,
  error: null,

  upload: async (file, folder = "review") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const { data } = await axios.post("/images/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as ImageUploadResponse;
  },

  uploadMultiple: async (files, folder = "review") => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("folder", folder);
    const { data } = await axios.post("/images/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as ImageMultiUploadResponse;
  },

  delete: async (imageUrl) => {
    const { data } = await axios.delete("/images/delete", {
      params: { imageUrl },
    });
    return data as { message: string };
  },

  guide: async () => {
    const { data } = await axios.get("/images/guide");
    return data as ImageGuideResponse;
  },
}));
