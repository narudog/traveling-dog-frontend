export interface TravelPlan {
    id: string;
    title: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    userId: string;
    nickname: string;
    travelLocations: TravelLocation[];
    viewCount: number;
    likeCount: number;
    status: PlanStatus;
    createdAt: string;
    updatedAt: string;
}

export interface TravelLocation {
    id: string;
    placeName: string;
    longitude: number;
    latitude: number;
    description: string;
    locationOrder: number;
    availableDate: string;
    createdAt: string;
    updatedAt: string;
}

export enum PlanStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    PRIVATE = "PRIVATE",
    DELETED = "DELETED",
}

export interface PlanCreateRequest {
    title: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
}

export interface PlanUpdateRequest {
    title: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
}
