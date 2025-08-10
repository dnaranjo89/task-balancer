import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/tasks", "routes/task-list.tsx"),
  route("/tasks/:taskId", "routes/task-valuation.tsx"),
  route("/task-preferences", "routes/task-preferences.tsx"),
  route("/:personId/does", "routes/task-selection.tsx"),
  route("/scoreboard", "routes/scoreboard.tsx"),
  route("/api/tasks", "routes/api.tasks.tsx"),
  route("/api/tasks/:taskId/rate", "routes/api.task-rate.tsx"),
  route("/api/task-preferences", "routes/api.task-preferences.tsx"),
  route("/api/extra-points", "routes/api.extra-points.tsx"),
  route("/api/manage-tasks", "routes/api.manage-tasks.tsx"),
  route("/api/delete-completed-task", "routes/api.delete-completed-task.tsx"),
] satisfies RouteConfig;
