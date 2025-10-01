export interface TodayActivityRequestDTO {
  location: string;
  category?: string;
}

export interface TodayActivityResponseDTO {
  location?: string;
  activities: {
    locationName: string;
    category: string;
  }[];
}

export interface SaveActivityRequestDTO {
  locationName: string;
  category: string;
  savedLocation?: string;
}

export interface SavedActivityResponseDTO {
  id: number;
  locationName: string;
  category: string;
  createdAt: string;
  savedLocation?: string;
}

export interface ActivityTaskStatus {
  taskId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  error?: string;
  result?: TodayActivityResponseDTO;
  createdAt: string;
}
