import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import { createCrudRouter } from "./routes/crudRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { env } from "./config/env.js";

export const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "vendorbridge-api" });
});

app.use("/api/auth", authRoutes);

app.use(requireAuth);
app.use("/api", workflowRoutes);
app.use("/api/dashboard", dashboardRoutes);

for (const resource of [
  "users",
  "vendors",
  "rfqs",
  "quotations",
  "approvals",
  "purchase-orders",
  "invoices",
  "notifications",
  "activity-logs",
]) {
  app.use(`/api/${resource}`, createCrudRouter(resource));
}

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  const message = status === 500 ? "Internal server error" : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({ message });
});
