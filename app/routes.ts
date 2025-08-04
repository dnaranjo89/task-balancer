import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/tasks", "routes/task-list.tsx"),
  route("/tasks/:taskId", "routes/task-detail.tsx"),
  route("/:personId/does", "routes/task-selection.tsx"),
  route("/scoreboard", "routes/scoreboard.tsx"),
  route("/api/tasks", "routes/api.tasks.tsx"),
  route("/api/tasks/:taskId/rate", "routes/api.task-rate.tsx"),
] satisfies RouteConfig;
