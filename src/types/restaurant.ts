export interface RestaurantRecommendationRequestDTO {
  cuisine?: string[];
  budgetLevel?: "low" | "medium" | "high";
  dietaryRestrictions?: string[];
}

export interface RestaurantRecommendationResponseDTO {
  planId: number;
  restaurants: Array<{
    name: string;
    address?: string;
    rating?: number;
    tags?: string[];
  }>;
}
