import dotenv from "dotenv";

dotenv.config({ override: true });

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL,
  pgHost: process.env.PGHOST || "localhost",
  pgPort: Number(process.env.PGPORT || 5432),
  pgDatabase: process.env.PGDATABASE || "vendorbridge",
  pgUser: process.env.PGUSER || "postgres",
  pgPassword: process.env.PGPASSWORD,
  jwtSecret: process.env.JWT_SECRET || "development_only_vendorbridge_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
