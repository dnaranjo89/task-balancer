import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/:personId/does", "routes/task-selection.tsx"),
  route("/scoreboard", "routes/scoreboard.tsx"),
  route("/api/tasks", "routes/api.tasks.tsx"),
] satisfies RouteConfig;
