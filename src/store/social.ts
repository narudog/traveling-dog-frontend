import { create } from "zustand";
import axios from "@/lib/axios";
import {
  ReviewCommentCreateRequest,
  ReviewCommentResponseDTO,
  SocialProfilePage,
  SocialProfileResponseDTO,
} from "@/types/social";
import { Page } from "@/types/common";

interface SocialState {
  loading: boolean;
  error: string | null;
}

interface SocialActions {
  follow: (userId: number) => Promise<void>;
  unfollow: (userId: number) => Promise<void>;
  followers: (
    userId: number,
    params?: { page?: number; size?: number }
  ) => Promise<SocialProfilePage>;
  following: (
    userId: number,
    params?: { page?: number; size?: number }
  ) => Promise<SocialProfilePage>;
  profile: (userId: number) => Promise<SocialProfileResponseDTO>;
  createComment: (
    reviewId: number,
    payload: ReviewCommentCreateRequest
  ) => Promise<ReviewCommentResponseDTO>;
  updateComment: (
    commentId: number,
    content: string
  ) => Promise<ReviewCommentResponseDTO>;
  deleteComment: (commentId: number) => Promise<void>;
  reviewComments: (
    reviewId: number,
    params?: { page?: number; size?: number }
  ) => Promise<Page<ReviewCommentResponseDTO>>;
  commentReplies: (commentId: number) => Promise<ReviewCommentResponseDTO[]>;
  followStatus: (userId: number) => Promise<boolean>;
  mutualFollow: (userId: number) => Promise<boolean>;
}

export const useSocialStore = create<SocialState & SocialActions>((set) => ({
  loading: false,
  error: null,

  follow: async (userId) => {
    await axios.post(`/social/follow/${userId}`);
  },

  unfollow: async (userId) => {
    await axios.delete(`/social/follow/${userId}`);
  },

  followers: async (userId, params = {}) => {
    const { data } = await axios.get(`/social/users/${userId}/followers`, {
      params,
    });
    return data as SocialProfilePage;
  },

  following: async (userId, params = {}) => {
    const { data } = await axios.get(`/social/users/${userId}/following`, {
      params,
    });
    return data as SocialProfilePage;
  },

  profile: async (userId) => {
    const { data } = await axios.get(`/social/users/${userId}/profile`);
    return data as SocialProfileResponseDTO;
  },

  createComment: async (reviewId, payload) => {
    const { data } = await axios.post(
      `/social/reviews/${reviewId}/comments`,
      payload
    );
    return data as ReviewCommentResponseDTO;
  },

  updateComment: async (commentId, content) => {
    const { data } = await axios.put(`/social/comments/${commentId}`, null, {
      params: { content },
    });
    return data as ReviewCommentResponseDTO;
  },

  deleteComment: async (commentId) => {
    await axios.delete(`/social/comments/${commentId}`);
  },

  reviewComments: async (reviewId, params = {}) => {
    const { data } = await axios.get(`/social/reviews/${reviewId}/comments`, {
      params,
    });
    return data as Page<ReviewCommentResponseDTO>;
  },

  commentReplies: async (commentId) => {
    const { data } = await axios.get(`/social/comments/${commentId}/replies`);
    return data as ReviewCommentResponseDTO[];
  },

  followStatus: async (userId) => {
    const { data } = await axios.get(`/social/users/${userId}/follow-status`);
    return Boolean(data);
  },

  mutualFollow: async (userId) => {
    const { data } = await axios.get(`/social/users/${userId}/mutual-follow`);
    return Boolean(data);
  },
}));
