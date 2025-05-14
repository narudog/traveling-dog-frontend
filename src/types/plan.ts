export interface TravelPlan {
  accommodation: [{ id: number; name: string }];
  budget: string;
  city: string;
  country: string;
  endDate: string;
  id: number;
  interests: [{ id: number; name: string }];
  itineraries: Itinerary[];
  likeCount: number;
  nickname: string | null;
  season: string;
  startDate: string;
  status: string;
  title: string;
  transportation: [{ id: number; name: string }];
  travelStyles: [{ id: number; name: string }];
  userId: number | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TravelPlanCreateRequest {
  city: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  accommodation: string;
  interests: string;
  transportation: string;
  userSpecifiedAccommodations: SelectedHotelByDate[];
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
