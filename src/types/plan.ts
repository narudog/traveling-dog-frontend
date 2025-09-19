export interface TravelPlan {
  id: number;
  city: string;
  country: string;
  title: string;
  startDate: string;
  endDate: string;
  travelStyles: [{ id: number; name: string }];
  interests: [{ id: number; name: string }];
  itineraries: Itinerary[];
  nickname: string | null;
  userId: number | null;
  viewCount: number;
  likeCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DraftTravelPlan {
  id: number;
  city: string;
  country: string;
  title: string;
  startDate: string;
  endDate: string;
  travelStyles: [{ id: number; name: string }];
  interests: [{ id: number; name: string }];
  itineraries: Itinerary[];
}

export interface TravelPlanCreateRequest {
  city: string;
  startDate: string;
  endDate: string;
  travelStyle: string;
  interests: string;
  userSpecifiedAccommodations: SelectedHotelByDate[];
}

export interface DraftTravelPlanSaveRequest {
  title: string;
  startDate: string;
  endDate: string;
  draftTripPlanId: number;
}

export interface SelectedHotelByDate {
  date: string;
  accommodation: string;
}

export interface Itinerary {
  id: number;
  date: number;
  activities: Location[];
  location: string;
}

export interface Location {
  id: number;
  title: string;
  description: string;
  locationName: string;
  cost?: string;
  orderIndex: number;
}

export enum PlanStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  PRIVATE = "PRIVATE",
  DELETED = "DELETED",
}

export interface PlanUpdateRequest {
  title: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
}

export interface PlaceWithRating {
  id?: number; // 액티비티 ID를 저장하기 위한 필드
  name?: string;
  rating?: number;
  totalRatings?: number;
  placeId?: string;
  reviews?: any;
  photos?: any;
}

export interface TravelPlanSearchRequest {
  keyword?: string;
  country?: string;
  city?: string;
  sortBy?: "popular" | "recent" | "oldest";
  page?: number;
  size?: number;
}

export interface TravelPlanSearchResponse {
  content: TravelPlan[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TaskStatus {
  taskId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  error?: string;
  userId?: number; // 사용자 ID
  savedPlanId?: number; // DraftTravelPlan의 ID
  createdAt: string;
}
