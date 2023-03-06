import express, { Router, json } from "express";
const appRouter = Router();
const app = express();
import SETTINGS from "./utils/settings.js";
import LOGGER from "./logger.js";
import { routeLogger } from "./logger.js";
import { config } from "dotenv";
import ejs from "ejs";
import path from "path";
import cookieParser from "cookie-parser";
import flash from "./middlewares/flash.js";
import formatUtils from "./middlewares/formatUtils.js";

config();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");
app.use(express.static(path.join(".", SETTINGS.views.location)));
app.use(json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(routeLogger);
app.use(flash);
app.use(formatUtils);
app.use("/", appRouter);

app.listen(SETTINGS.port, () =>
  LOGGER.info("Server started on port", SETTINGS.port)
);

export default appRouter;
