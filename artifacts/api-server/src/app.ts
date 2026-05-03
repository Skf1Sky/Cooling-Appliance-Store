import "express-session";
import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: string;
  }
}

const PgStore = ConnectPgSimple(session);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const allowedOrigins = process.env["ALLOWED_ORIGINS"]?.split(",") ?? [];
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env["SESSION_SECRET"];
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

app.use(
  session({
    store: new PgStore({
      conString: databaseUrl,
      tableName: "session",
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env["NODE_ENV"] === "production" ? "none" : "lax",
    },
  }),
);

app.use("/api", router);

export default app;
