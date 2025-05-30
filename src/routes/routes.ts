import { Hono } from "hono";

import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./users-routes";
import { postsRoutes } from "./posts-routes";
import { likesRoutes } from "./likes-routes";
import { commentsRoutes } from "./comments-routes";
import { cors } from "hono/cors";
import { authRoute } from "./middlewares/session-middleware";
import { webClientUrl } from "../../environment";


//import { swaggerRoutes } from "./swagger-routes";

export const allRoutes = new Hono();

allRoutes.use(
  "*",
  cors({
    origin: webClientUrl, // ✅ Only allow your frontend
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

allRoutes.route("/api/auth", authRoute)
allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likesRoutes);
//allRoutes.route("/comments", commentsRoutes);
allRoutes.route("/comments", commentsRoutes);
//allRoutes.route("/ui", swaggerRoutes);
allRoutes.get("/health", (context) => {
  return context.json(
    {
      message: "All Ok",
    },
    200
  );
});
