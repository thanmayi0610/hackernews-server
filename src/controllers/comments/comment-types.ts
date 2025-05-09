// src/controllers/comments/comment-types.ts

import type { Comment } from "../../generated/prisma";


export type CreateCommentParameters = {
  text: string;
  parentId?: string; // Optional for nested comments
};

export type CreateCommentResult = {
  comment: Comment;
};

export enum CreateCommentError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}

export type GetCommentsResult = {
  comments: (Comment & { 
    user: {
      id: string;
      username: string;
    },
    replies?: Comment[]
  })[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
};

export enum GetCommentsError {
  POST_NOT_FOUND = "POST_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}

export type UpdateCommentParameters = {
  text: string;
};

export enum UpdateCommentError {
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}

export enum DeleteCommentError {
  COMMENT_NOT_FOUND = "COMMENT_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN"
}