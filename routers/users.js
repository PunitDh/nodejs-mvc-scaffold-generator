import { Router } from "express";
import User from "../models/User.js";
import { compare, hashed } from "../bin/utils/bcrypt.js";
import JWT from "jsonwebtoken";
import authorize from "../bin/middlewares/authorize.js";

const users = Router();

users.get("/", authorize, async (req, res) => {
  try {
    const users = (await User.all()).map(user => user.exclude("password"));
    if (req.query.login === "success") {
      res.locals.flash.success = "Login success";
      return res.render("users/index", { users });
    }
    return res.render("users/index", { users });
  } catch (e) {
    res.locals.flash.error = e.message;
    return res.render("users/index", { users: [] });
  }
});

users.get("/register", async (_, res) => {
  try {
    res.render("users/register");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...user } = (await User.find(id)).exclude("password");
    return res.render("users/edit", { user });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.find(id);
  try {
    const { oldPassword, passwordConfirmation, ...body } = req.body;
    if (!compare(oldPassword, user.password)) {
      res.locals.flash.error = "Old password does not match";
      return res.render("users/edit", { user });
    }
    if (body.password !== passwordConfirmation) {
      res.locals.flash.error = "New passwords do not match";
      return res.render("users/edit", { user });
    }
    const updated = { ...body, password: hashed(body.password) };
    await User.update(id, updated);
    return res.redirect("/users");
  } catch (e) {
    res.locals.flash.error = e.message;
    return res.render("users/edit", { user });
  }
});

users.get("/login", async (_, res) => {
  try {
    return res.render("users/login");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbUser = await User.findBy({ email });
    if (!dbUser) {
      res.locals.flash.error = "User not found";
      return res.render("users/login");
    }
    const { password: userPassword, ...user } = dbUser;

    if (!compare(password, userPassword)) {
      res.locals.flash.error = "Wrong password";
      return res.render("users/login");
    }
    await dbUser.save();
    res.cookie(
      "app",
      JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.COOKIE_EXPIRY,
      })
    );
    return res.redirect(`/users?login=success`);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/logout", async (req, res) => {
  try {
    res.clearCookie("app");
    res.locals.flash.success = "User logged out";
    res.render("users/login");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    return res.redirect("/users");
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { password, ...user } = await User.find(id);
    return res.status(200).send(user);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

users.post("/", async (req, res) => {
  try {
    const { passwordConfirmation, ...body } = req.body;
    if (passwordConfirmation !== body.password) {
      res.locals.flash.error = "Passwords do not match";
      return res.render("users/register");
    }
    const user = { ...body, password: hashed(body.password) };
    await User.create(user);
    return res.redirect("/users");
  } catch (e) {
    res.locals.flash.error = e.message;
    return res.render("users/register");
  }
});

export default users;
