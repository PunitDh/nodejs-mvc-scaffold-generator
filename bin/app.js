import express, { Router, json } from "express";
const appRouter = Router();
const app = express();
import settings from "./settings.js";
import LOGGER from "./logger.js";
import { routeLogger } from "./logger.js";
import dbErrorHandler from "./errorhandler.js";
import { config } from "dotenv";
import ejs from "ejs";
import path from "path";

config();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");
app.use(express.static(path.join(".", settings.views.location)));
app.use(json());
app.use(express.urlencoded());
app.use(routeLogger);
app.use("/", appRouter);
// app.use(dbErrorHandler);

app.listen(settings.port, () =>
  LOGGER.info("Server started on port", settings.port)
);

export default appRouter;
