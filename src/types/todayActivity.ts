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

export interface SavedActivityResponseDTO extends TodayActivityResponseDTO {
  savedAt: string;
}
