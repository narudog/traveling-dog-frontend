import { Page } from "./common";

export interface TripReviewCreateRequest {
  title: string;
  content: string;
  planId?: number;
  isPublic?: boolean;
  tags?: string[];
  photos?: string[];
}

export interface TripReviewUpdateRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
  photos?: string[];
}

export interface TripReviewResponseDTO {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
  photos: string[];
  likeCount: number;
  viewCount: number;
}

export type TripReviewFeedSort = "latest" | "popular" | "views";

export type TripReviewPage = Page<TripReviewResponseDTO>;
