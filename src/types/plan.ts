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
}

export interface Itinerary {
  id: number;
  date: number;
  activities: Location[];
  location: string;
  lunch: Location;
  dinner: Location;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
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
