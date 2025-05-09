// src/controllers/comments/comment-controller.ts
import { prismaClient } from "../../integrations/prisma";
import { 
  type CreateCommentParameters, 
  type CreateCommentResult, 
  CreateCommentError,
  type GetCommentsResult,
  GetCommentsError,
  type UpdateCommentParameters,
  UpdateCommentError,
  DeleteCommentError
} from "./comment-types";

export const createComment = async (
  parameters: CreateCommentParameters & { 
    postId: string, 
    userId: string 
  }
): Promise<CreateCommentResult> => {
  try {
    // First, check if the post exists
    const post = await prismaClient.post.findUnique({
      where: { id: parameters.postId }
    });

    if (!post) {
      throw CreateCommentError.POST_NOT_FOUND;
    }

    // Create the comment
    const comment = await prismaClient.comment.create({
      data: {
        text: parameters.text,
        userId: parameters.userId,
        postId: parameters.postId,
        parentId: parameters.parentId // Optional
      }
    });

    return { comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    
    if (error === CreateCommentError.POST_NOT_FOUND) {
      throw error;
    }

    throw CreateCommentError.UNKNOWN;
  }
};

export const getCommentsOnPost = async (
  parameters: { 
    postId: string, 
    page?: number, 
    limit?: number 
  }
): Promise<GetCommentsResult> => {
  try {
    const page = parameters.page || 1;
    const limit = parameters.limit || 10;
    const skip = (page - 1) * limit;

    // First, check if the post exists
    const post = await prismaClient.post.findUnique({
      where: { id: parameters.postId }
    });

    if (!post) {
      throw GetCommentsError.POST_NOT_FOUND;
    }

    // Fetch comments with user details and top-level replies
    const comments = await prismaClient.comment.findMany({
      where: { 
        postId: parameters.postId,
        parentId: null // Only top-level comments
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    // Count total comments for this post
    const totalComments = await prismaClient.comment.count({
      where: { 
        postId: parameters.postId,
        parentId: null 
      }
    });

    return {
      comments,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    
    if (error === GetCommentsError.POST_NOT_FOUND) {
      throw error;
    }

    throw GetCommentsError.UNKNOWN;
  }
};

export const updateComment = async (
  parameters: UpdateCommentParameters & { 
    commentId: string, 
    userId: string 
  }
): Promise<void> => {
  try {
    // Find the comment to update
    const comment = await prismaClient.comment.findUnique({
      where: { 
        id: parameters.commentId,
        userId: parameters.userId 
      }
    });

    // If no comment exists or doesn't belong to the user, throw an error
    if (!comment) {
      throw UpdateCommentError.COMMENT_NOT_FOUND;
    }

    // Update the comment
    await prismaClient.comment.update({
      where: { id: parameters.commentId },
      data: { text: parameters.text }
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    
    if (error === UpdateCommentError.COMMENT_NOT_FOUND) {
      throw error;
    }

    throw UpdateCommentError.UNKNOWN;
  }
};

export const deleteComment = async (
  parameters: { 
    commentId: string, 
    userId: string 
  }
): Promise<void> => {
  try {
    // Find the comment to delete
    const comment = await prismaClient.comment.findUnique({
      where: { 
        id: parameters.commentId,
        userId: parameters.userId 
      }
    });

    // If no comment exists or doesn't belong to the user, throw an error
    if (!comment) {
      throw DeleteCommentError.COMMENT_NOT_FOUND;
    }

    // Delete the comment (Prisma will cascade delete replies)
    await prismaClient.comment.delete({
      where: { id: parameters.commentId }
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    
    if (error === DeleteCommentError.COMMENT_NOT_FOUND) {
      throw error;
    }

    throw DeleteCommentError.UNKNOWN;
  }
};