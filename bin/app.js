import express, { Router, json } from "express";
const appRouter = Router();
const app = express();
import SETTINGS from "./utils/settings.js";
import LOGGER from "./logger.js";
import { config } from "dotenv";
import ejs from "ejs";
import path from "path";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import appUtils from "./middleware/appUtils.js";
import routeLogger from "./middleware/logger.js";
import { PATHS } from "./constants.js";
import errorHandler from "./middleware/errorHandler.js";
import multer from "multer";
import upload from "./middleware/upload.js";

// Load config
config();

// Set view engine
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");

// File storage

// Package Middleware
app.use(express.static(path.join(PATHS.root, SETTINGS.views.location)));
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());

// Custom Middleware
app.use(routeLogger());
app.use(appUtils());
app.use("/", appRouter);

app.use(errorHandler);

app.get("/403", function (req, res) {
  res.status(403).render("pages/403");
});

app.get("/401", function (req, res) {
  res.status(401).render("pages/401");
});

app.get("*", function (req, res) {
  res.status(404).render("pages/404");
});

// Start server
app.listen(SETTINGS.port, () =>
  LOGGER.info("Server started on port", SETTINGS.port)
);

export default appRouter;
