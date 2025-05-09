// src/controllers/likes/like-controller.ts
import { prismaClient } from "../../integrations/prisma";
import { 
  type CreateLikeResult, 
  CreateLikeError,
  type GetLikesResult,
  GetLikesError,
  DeleteLikeError
} from "./like-types";

export const createLike = async (
  parameters: { 
    postId: string, 
    userId: string 
  }
): Promise<CreateLikeResult> => {
  try {
    // First, check if the post exists
    const post = await prismaClient.post.findUnique({
      where: { id: parameters.postId }
    });

    if (!post) {
      throw CreateLikeError.POST_NOT_FOUND;
    }

    // Check if like already exists
    const existingLike = await prismaClient.like.findUnique({
      where: {
        userId_postId: {
          userId: parameters.userId,
          postId: parameters.postId
        }
      }
    });

    if (existingLike) {
      // If like already exists, return the existing like
      return { like: existingLike };
    }

    // Create the like
    const like = await prismaClient.like.create({
      data: {
        userId: parameters.userId,
        postId: parameters.postId
      }
    });

    return { like };
  } catch (error) {
    console.error("Error creating like:", error);
    
    if (error === CreateLikeError.POST_NOT_FOUND) {
      throw error;
    }

    throw CreateLikeError.UNKNOWN;
  }
};

export const getLikesOnPost = async (
  parameters: { 
    postId: string, 
    page?: number, 
    limit?: number 
  }
): Promise<GetLikesResult> => {
  try {
    const page = parameters.page || 1;
    const limit = parameters.limit || 10;
    const skip = (page - 1) * limit;

    // First, check if the post exists
    const post = await prismaClient.post.findUnique({
      where: { id: parameters.postId }
    });

    if (!post) {
      throw GetLikesError.POST_NOT_FOUND;
    }

    // Fetch likes with user details
    const likes = await prismaClient.like.findMany({
      where: { postId: parameters.postId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    // Count total likes for this post
    const totalLikes = await prismaClient.like.count({
      where: { postId: parameters.postId }
    });

    return {
      likes,
      totalLikes,
      totalPages: Math.ceil(totalLikes / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching likes:", error);
    
    if (error === GetLikesError.POST_NOT_FOUND) {
      throw error;
    }

    throw GetLikesError.UNKNOWN;
  }
};

export const deleteLike = async (
  parameters: { 
    postId: string, 
    userId: string 
  }
): Promise<void> => {
  try {
    // Find the like to delete
    const like = await prismaClient.like.findUnique({
      where: {
        userId_postId: {
          userId: parameters.userId,
          postId: parameters.postId
        }
      }
    });

    // If no like exists, throw an error
    if (!like) {
      throw DeleteLikeError.LIKE_NOT_FOUND;
    }

    // Delete the like
    await prismaClient.like.delete({
      where: {
        userId_postId: {
          userId: parameters.userId,
          postId: parameters.postId
        }
      }
    });
  } catch (error) {
    console.error("Error deleting like:", error);
    
    if (error === DeleteLikeError.LIKE_NOT_FOUND) {
      throw error;
    }

    throw DeleteLikeError.UNKNOWN;
  }
};