// src/controllers/likes/like-types.ts

import type { Like } from "../../generated/prisma";


export interface CreateLikeResult {
  like: Like;
}

export enum CreateLikeError {
  ALREADY_LIKED = "ALREADY_LIKED",
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}

export interface GetLikesResult {
  likes: (Like & { 
    user: {
      id: string;
      username: string;
    }
  })[];
  totalLikes: number;
  totalPages: number;
  currentPage: number;
}

export enum GetLikesError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}

export enum DeleteLikeError {
  LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}