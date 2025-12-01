import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

import urlRecordRouter from "./routes/urlRecordRoute.js";
import urlRedirectRouter from "./routes/urlRedirectRoute.js";

import rateLimiter from "./utils/rateLimiter.js";
import { pinoHttpMiddleware } from "./utils/loggerHelper.js";

const PROJECT_URL = process.env.PROJECT_URL;

const app = express();

app.use(express.json());
app.use(cors({
    origin: PROJECT_URL,
}));
app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(rateLimiter);
app.use(pinoHttpMiddleware);

app.use("/v1", urlRecordRouter);
app.use("/v1", urlRedirectRouter);

export default app;
