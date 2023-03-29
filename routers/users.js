import { Router } from "express";
import User from "../models/User.js";
import { compare, hashed } from "../bin/utils/bcrypt.js";
import JWT from "jsonwebtoken";
import authenticated from "../bin/middleware/authenticated.js";
import { Flash } from "../bin/constants.js";
import _Jwt from "../bin/domain/JWT.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../bin/errors.js";

const users = Router();

users.get("/", authenticated, (req, res, next) => {
  try {
    const users = User.all()?.map((user) => user.exclude("password"));
    return res.render("users/index", { users });
  } catch (e) {
    next(e);
  }
});

users.get("/register", (_, res, next) => {
  try {
    res.render("users/register");
  } catch (e) {
    next(e);
  }
});

users.get("/edit/:id", (req, res, next) => {
  try {
    const user = User.find(req.params.id)?.exclude("password");
    return res.render("users/edit", { user });
  } catch (e) {
    e.status = 404;
    next(e);
  }
});

users.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const user = User.find(id);
  try {
    const { oldPassword, passwordConfirmation, ...body } = req.body;
    if (!compare(oldPassword, user.password)) {
      throw new UnauthorizedError("Old password does not match");
    }
    if (body.password !== passwordConfirmation) {
      throw new BadRequestError("New passwords do not match");
    }
    const updated = { ...body, password: hashed(body.password) };
    User.update(id, updated);
    return res.redirect("/users");
  } catch (e) {
    next(e);
  }
});

users.get("/login", (req, res, next) => {
  try {
    const { referer } = req.query;
    return res.render("users/login", { referer });
  } catch (e) {
    next(e);
  }
});

users.post("/login", (req, res, next) => {
  try {
    const { email, password } = req.body;
    const dbUser = User.findBy({ email });
    if (!dbUser) {
      throw new NotFoundError("User not found");
    }
    const { password: userPassword, ...user } = dbUser;

    if (!compare(password, userPassword)) {
      throw new UnauthorizedError("Wrong password");
    }
    dbUser.save();
    res.cookie(
      "app",
      JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.COOKIE_EXPIRY,
      })
    );
    req.flash(Flash.SUCCESS, "Logged in successfully");
    if (req.query.referer) return res.redirect(req.query.referer);
    return res.redirect(`/users`);
  } catch (e) {
    next(e);
  }
});

users.get("/logout", (req, res, next) => {
  try {
    res.redirect("/users/login");
  } catch (e) {
    next(e);
  }
});

users.post("/logout", (req, res, next) => {
  try {
    _Jwt.add(req.cookies.app);
    res.clearCookie("app");
    req.flash(Flash.SUCCESS, "Logged out successfully");
    res.redirect("/users/login");
  } catch (e) {
    next(e);
  }
});

users.post("/delete/:id", (req, res, next) => {
  try {
    if (res.locals.currentUser.id !== parseInt(req.params.id)) {
      req.flash(Flash.ERROR, "You are not authorized to perform this action");
      return res.status(403).redirect("/403");
    }
    User.delete(req.params.id);
    req.flash(Flash.SUCCESS, "User has been deleted");
    return res.redirect("/users");
  } catch (e) {
    next(e);
  }
});

users.get("/:id", (req, res, next) => {
  try {
    const user = User.find(req.params.id).exclude("password", "_csrf_token");
    return res.status(200).render("users/user", { user });
  } catch (e) {
    next(e);
  }
});

users.post("/", (req, res, next) => {
  try {
    const { passwordConfirmation, ...body } = req.body;
    if (passwordConfirmation !== body.password) {
      throw new BadRequestError("Passwords do not match");
    }
    const user = { ...body, password: hashed(body.password) };
    User.create(user);
    return res.redirect("/users");
  } catch (e) {
    next(e);
  }
});

export default users;
