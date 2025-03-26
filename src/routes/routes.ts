import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./users-routes";
import { logger } from "hono/logger";

export const allRoutes = new Hono();

allRoutes.use(logger());

allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);

allRoutes.get("/health", (context) => {
  return context.json(
    {
      message: "All Ok",
    },
    200
  );
});