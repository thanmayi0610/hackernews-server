//OLD CODE
// src/routes/comments-routes.ts
// import { Hono } from "hono";
// import { tokenMiddleware } from "./middlewares/token-middleware";
// import { 
//   createComment, 
//   getCommentsOnPost, 
//   updateComment,
//   deleteComment
// } from "../controllers/comments/comment-controller";
// import { 
//   CreateCommentError, 
//   GetCommentsError,
//   UpdateCommentError,
//   DeleteCommentError
// } from "../controllers/comments/comment-types";

// export const commentsRoutes = new Hono();

// // GET comments on a specific post
// commentsRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
//   try {
//     const postId = context.req.param("postId");
//     const page = parseInt(context.req.query("page") || "1", 10);
//     const limit = parseInt(context.req.query("limit") || "10", 10);

//     if (page < 1 || limit < 1) {
//       return context.json({
//         message: "Invalid page or limit"
//       }, 400);
//     }

//     const comments = await getCommentsOnPost({
//       postId,
//       page,
//       limit
//     });

//     return context.json(
//       {
//         data: comments,
//       },
//       200
//     );
//   } catch (e) {
//     if (e === GetCommentsError.POST_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Post not found",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // CREATE a comment on a post
// commentsRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
//   try {
//     const userId = context.get("userId");
//     const postId = context.req.param("postId");
//     const { text, parentId } = await context.req.json();

//     // Validate input
//     if (!text) {
//       return context.json(
//         {
//           message: "Comment text is required",
//         },
//         400
//       );
//     }

//     const result = await createComment({
//       userId,
//       postId,
//       text,
//       parentId
//     });

//     return context.json(
//       {
//         data: result.comment,
//       },
//       201
//     );
//   } catch (e) {
//     if (e === CreateCommentError.POST_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Post not found",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // UPDATE a comment
// commentsRoutes.patch("/:commentId", tokenMiddleware, async (context) => {
//   try {
//     const userId = context.get("userId");
//     const commentId = context.req.param("commentId");
//     const { text } = await context.req.json();

//     // Validate input
//     if (!text) {
//       return context.json(
//         {
//           message: "Comment text is required",
//         },
//         400
//       );
//     }

//     await updateComment({
//       userId,
//       commentId,
//       text
//     });

//     return context.json(
//       {
//         message: "Comment updated successfully",
//       },
//       200
//     );
//   } catch (e) {
//     if (e === UpdateCommentError.COMMENT_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Comment not found or unauthorized",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // DELETE a comment
// commentsRoutes.delete("/:commentId", tokenMiddleware, async (context) => {
//   try {
//     const userId = context.get("userId");
//     const commentId = context.req.param("commentId");

//     await deleteComment({
//       userId,
//       commentId
//     });

//     return context.json(
//       {
//         message: "Comment deleted successfully",
//       },
//       200
//     );
//   } catch (e) {
//     if (e === DeleteCommentError.COMMENT_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Comment not found or unauthorized",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });
// NEW CODE
// src/routes/comments-routes.ts
// import { Hono } from "hono";
// import { sessionMiddleware } from "./middlewares/session-middleware";
// import { 
//   createComment, 
//   getCommentsOnPost, 
//   updateComment,
//   deleteComment
// } from "../controllers/comments/comment-controller";
// import { 
//   CreateCommentError, 
//   GetCommentsError,
//   UpdateCommentError,
//   DeleteCommentError
// } from "../controllers/comments/comment-types";
// import { prismaClient } from "../extras/prisma"; // ✅ required for /all route

// export const commentsRoutes = new Hono();

// // GET comments on a specific post
// commentsRoutes.get("/on/:postId", sessionMiddleware, async (context) => {
//   try {
//     const postId = context.req.param("postId");
//     const page = parseInt(context.req.query("page") || "1", 10);
//     const limit = parseInt(context.req.query("limit") || "10", 10);

//     if (page < 1 || limit < 1) {
//       return context.json({
//         message: "Invalid page or limit"
//       }, 400);
//     }

//     const comments = await getCommentsOnPost({
//       postId,
//       page,
//       limit
//     });

//     return context.json(
//       {
//         data: comments,
//       },
//       200
//     );
//   } catch (e) {
//     if (e === GetCommentsError.POST_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Post not found",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // CREATE a comment on a post
// commentsRoutes.post("/on/:postId", sessionMiddleware, async (context) => {
//   try {
//     const user = context.get("user");
//     const userId = user.id;
//     const postId = context.req.param("postId");
//     const { text, parentId } = await context.req.json();

//     if (!text) {
//       return context.json(
//         {
//           message: "Comment text is required",
//         },
//         400
//       );
//     }

//     const result = await createComment({
//       userId,
//       postId,
//       text,
//       parentId
//     });

//     return context.json(
//       {
//         data: result.comment,
//       },
//       201
//     );
//   } catch (e) {
//     if (e === CreateCommentError.POST_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Post not found",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // UPDATE a comment
// commentsRoutes.patch("/:commentId", sessionMiddleware, async (context) => {
//   try {
//     const user = context.get("user");
//     const userId = user.id;
//     const commentId = context.req.param("commentId");
//     const { text } = await context.req.json();

//     if (!text) {
//       return context.json(
//         {
//           message: "Comment text is required",
//         },
//         400
//       );
//     }

//     await updateComment({
//       userId,
//       commentId,
//       text
//     });

//     return context.json(
//       {
//         message: "Comment updated successfully",
//       },
//       200
//     );
//   } catch (e) {
//     if (e === UpdateCommentError.COMMENT_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Comment not found or unauthorized",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // DELETE a comment
// commentsRoutes.delete("/:commentId", sessionMiddleware, async (context) => {
//   try {
//     const user = context.get("user");
//     const userId = user.id;
//     const commentId = context.req.param("commentId");

//     await deleteComment({
//       userId,
//       commentId
//     });

//     return context.json(
//       {
//         message: "Comment deleted successfully",
//       },
//       200
//     );
//   } catch (e) {
//     if (e === DeleteCommentError.COMMENT_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Comment not found or unauthorized",
//         },
//         404
//       );
//     }

//     return context.json(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// });

// // ✅ NEW: GET all comments across all posts
// commentsRoutes.get("/all", sessionMiddleware, async (ctx) => {
//   const comments = await prismaClient.comment.findMany({
//     orderBy: { createdAt: "desc" },
//     include: {
//       user: { select: { username: true } },
//     },
//   });

//   return ctx.json({ data: comments });
// });
//new code 2.0
// src/routes/comments-routes.ts

import { Hono } from "hono";
import { sessionMiddleware } from "./middlewares/session-middleware";
import { 
  createComment, 
  getCommentsOnPost, 
  updateComment,
  deleteComment
} from "../controllers/comments/comment-controller";
import { 
  CreateCommentError, 
  GetCommentsError,
  UpdateCommentError,
  DeleteCommentError
} from "../controllers/comments/comment-types";
import { prismaClient } from "../extras/prisma";

export const commentsRoutes = new Hono();

// GET comments on a specific post
commentsRoutes.get("/on/:postId", sessionMiddleware, async (context) => {
  try {
    const postId = context.req.param("postId");
    const page = parseInt(context.req.query("page") || "1", 10);
    const limit = parseInt(context.req.query("limit") || "10", 10);

    if (page < 1 || limit < 1) {
      return context.json({
        message: "Invalid page or limit"
      }, 400);
    }

    const comments = await getCommentsOnPost({
      postId,
      page,
      limit
    });

    return context.json(
      {
        data: comments,
      },
      200
    );
  } catch (e) {
    if (e === GetCommentsError.POST_NOT_FOUND) {
      return context.json(
        {
          message: "Post not found",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// ✅ FIXED: CREATE a comment on a post (fetch full comment with user)
commentsRoutes.post("/on/:postId", sessionMiddleware, async (context) => {
  try {
    const user = context.get("user");
    const userId = user.id;
    const postId = context.req.param("postId");
    const { text, parentId } = await context.req.json();

    if (!text) {
      return context.json(
        {
          message: "Comment text is required",
        },
        400
      );
    }

    const result = await createComment({
      userId,
      postId,
      text,
      parentId
    });

    // ✅ Fetch full comment including user
    const fullComment = await prismaClient.comment.findUnique({
      where: { id: result.comment.id },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return context.json(
      {
        data: fullComment,
      },
      201
    );
  } catch (e) {
    console.error("Error creating comment:", e);
    if (e === CreateCommentError.POST_NOT_FOUND) {
      return context.json(
        {
          message: "Post not found",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// UPDATE a comment
commentsRoutes.patch("/:commentId", sessionMiddleware, async (context) => {
  try {
    const user = context.get("user");
    const userId = user.id;
    const commentId = context.req.param("commentId");
    const { text } = await context.req.json();

    if (!text) {
      return context.json(
        {
          message: "Comment text is required",
        },
        400
      );
    }

    await updateComment({
      userId,
      commentId,
      text
    });

    return context.json(
      {
        message: "Comment updated successfully",
      },
      200
    );
  } catch (e) {
    if (e === UpdateCommentError.COMMENT_NOT_FOUND) {
      return context.json(
        {
          message: "Comment not found or unauthorized",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// DELETE a comment
commentsRoutes.delete("/:commentId", sessionMiddleware, async (context) => {
  try {
    const user = context.get("user");
    const userId = user.id;
    const commentId = context.req.param("commentId");

    await deleteComment({
      userId,
      commentId
    });

    return context.json(
      {
        message: "Comment deleted successfully",
      },
      200
    );
  } catch (e) {
    if (e === DeleteCommentError.COMMENT_NOT_FOUND) {
      return context.json(
        {
          message: "Comment not found or unauthorized",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// GET all comments across all posts
commentsRoutes.get("/all", sessionMiddleware, async (ctx) => {
  const comments = await prismaClient.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true } },
    },
  });

  return ctx.json({ data: comments });
});
