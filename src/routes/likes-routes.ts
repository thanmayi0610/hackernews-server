// // // src/routes/likes-routes.ts
// import { Hono } from "hono";
// import { tokenMiddleware } from "./middlewares/token-middleware";
// import { 
//   createLike, 
//   getLikesOnPost, 
//   deleteLike 
// } from "../controllers/likes/like-controller";
// import { 
//   CreateLikeError, 
//   GetLikesError,
//   DeleteLikeError
// } from "../controllers/likes/like-types";

// export const likesRoutes = new Hono();

// // GET likes on a specific post
// likesRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
//   try {
//     const postId = context.req.param("postId");
//     const page = parseInt(context.req.query("page") || "1", 10);
//     const limit = parseInt(context.req.query("limit") || "10", 10);

//     if (page < 1 || limit < 1) {
//       return context.json({
//         message: "Invalid page or limit"
//       }, 400);
//     }

//     const likes = await getLikesOnPost({
//       postId,
//       page,
//       limit
//     });

//     return context.json(
//       {
//         data: likes,
//       },
//       200
//     );
//   } catch (e) {
//     if (e === GetLikesError.POST_NOT_FOUND) {
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

// // CREATE a like on a post
// likesRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
//   try {
//     const userId = context.get("userId");
//     const postId = context.req.param("postId");

//     const result = await createLike({
//       userId,
//       postId
//     });

//     return context.json(
//       {
//         data: result.like,
//       },
//       201
//     );
//   } catch (e) {
//     if (e === CreateLikeError.POST_NOT_FOUND) {
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

// // DELETE a like on a post
// likesRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
//   try {
//     const userId = context.get("userId");
//     const postId = context.req.param("postId");

//     await deleteLike({
//       userId,
//       postId
//     });

//     return context.json(
//       {
//         message: "Like deleted successfully",
//       },
//       200
//     );
//   } catch (e) {
//     if (e === DeleteLikeError.LIKE_NOT_FOUND) {
//       return context.json(
//         {
//           message: "Like not found",
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
// src/routes/likes-routes.ts

import { Hono } from "hono";
import { sessionMiddleware } from "./middlewares/session-middleware"; // ✅ updated
import { 
  createLike, 
  getLikesOnPost, 
  deleteLike 
} from "../controllers/likes/like-controller";
import { 
  CreateLikeError, 
  GetLikesError,
  DeleteLikeError
} from "../controllers/likes/like-types";

export const likesRoutes = new Hono();

// GET likes on a specific post
likesRoutes.get("/on/:postId", sessionMiddleware, async (context) => { // ✅ updated
  try {
    const postId = context.req.param("postId");
    const page = parseInt(context.req.query("page") || "1", 10);
    const limit = parseInt(context.req.query("limit") || "10", 10);

    if (page < 1 || limit < 1) {
      return context.json({
        message: "Invalid page or limit"
      }, 400);
    }

    const likes = await getLikesOnPost({
      postId,
      page,
      limit
    });

    return context.json(
      {
        data: likes,
      },
      200
    );
  } catch (e) {
    if (e === GetLikesError.POST_NOT_FOUND) {
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

// CREATE a like on a post
likesRoutes.post("/on/:postId", sessionMiddleware, async (context) => { // ✅ updated
  try {
    const user = context.get("user"); // ✅ changed
    const userId = user.id;
    const postId = context.req.param("postId");

    const result = await createLike({
      userId,
      postId
    });

    return context.json(
      {
        data: result.like,
      },
      201
    );
  } catch (e) {
    if (e === CreateLikeError.POST_NOT_FOUND) {
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

// DELETE a like on a post
likesRoutes.delete("/on/:postId", sessionMiddleware, async (context) => { // ✅ updated
  try {
    const user = context.get("user"); // ✅ changed
    const userId = user.id;
    const postId = context.req.param("postId");

    await deleteLike({
      userId,
      postId
    });

    return context.json(
      {
        message: "Like deleted successfully",
      },
      200
    );
  } catch (e) {
    if (e === DeleteLikeError.LIKE_NOT_FOUND) {
      return context.json(
        {
          message: "Like not found",
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
