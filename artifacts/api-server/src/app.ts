import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { serveFrontend } from "./lib/static";

const app: Express = express();

// Trust the first proxy hop so req.ip reflects the real client behind
// Vercel / a reverse proxy (used by the /lead rate limiter).
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve the built frontend from the same process when a build is present.
// Keeps the whole site on a single origin in production.
if (serveFrontend(app)) {
  logger.info("Serving frontend build from the API server");
}

export default app;
