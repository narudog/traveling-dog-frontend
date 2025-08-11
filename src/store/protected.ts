import { create } from "zustand";
import axios from "@/lib/axios";

interface ProtectedState {
  loading: boolean;
  error: string | null;
}

interface ProtectedActions {
  check: () => Promise<string>;
}

export const useProtectedStore = create<ProtectedState & ProtectedActions>(
  () => ({
    loading: false,
    error: null,
    check: async () => {
      const { data } = await axios.get("/protected");
      return String(data);
    },
  })
);
