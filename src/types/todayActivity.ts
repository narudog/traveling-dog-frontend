export interface TodayActivityRequestDTO {
  city: string;
  category?: string;
}

export interface TodayActivityResponseDTO {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: string;
}

export interface SaveActivityRequestDTO {
  activityId: string;
}

export interface SavedActivityResponseDTO extends TodayActivityResponseDTO {
  savedAt: string;
}
