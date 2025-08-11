import { Page } from "./common";

export interface SocialProfileResponseDTO {
  userId: number;
  nickname: string;
  bio?: string;
  followers: number;
  following: number;
  avatarUrl?: string;
}

export interface ReviewCommentCreateRequest {
  content: string;
  parentCommentId?: number;
}

export interface ReviewCommentResponseDTO {
  id: number;
  reviewId: number;
  authorId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: number | null;
}

export type SocialProfilePage = Page<SocialProfileResponseDTO>;
