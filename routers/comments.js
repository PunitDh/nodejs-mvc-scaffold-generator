import { Router } from "express";
import Comment from "../models/Comment.js";
import csrf from "../bin/middleware/csrf.js";
import Blog from "../models/Blog.js";
const comments = Router();

comments.use(csrf());

comments.get("/", (req, res, next) => {
  try {
    const comments = Comment.all();
    return res.render("comments/index", { comments });
  } catch (e) {
    next(e);
  }
});

comments.get("/new", (req, res, next) => {
  try {
    const comment = new Comment();
    const blogs = Blog.all();
    return res.render("comments/new", { comment, blogs });
  } catch (e) {
    next(e);
  }
});

comments.get("/edit/:id", (req, res, next) => {
  try {
    const comment = Comment.find(req.params.id);
    const blogs = Blog.all();
    return res.render("comments/edit", { comment, blogs });
  } catch (e) {
    next(e);
  }
});

comments.post("/edit/:id", (req, res, next) => {
  try {
    Comment.update(req.params.id, req.body);
    req.flash("success", "Comment has been updated");
    return res.redirect(`/comments`);
  } catch (e) {
    next(e);
  }
});

comments.post("/delete/:id", (req, res, next) => {
  try {
    Comment.delete(req.params.id);
    req.flash("success", "Comment has been deleted");
    return res.redirect("/comments");
  } catch (e) {
    next(e);
  }
});

comments.get("/:id", (req, res, next) => {
  try {
    const comment = Comment.find(req.params.id);
    return res.render("comments/comment", {
      comment: res.locals.marked(comment),
    });
  } catch (e) {
    next(e);
  }
});

comments.post("/new", (req, res, next) => {
  try {
    Comment.create(req.body);
    req.flash("success", "Comment has been added");
    return res.redirect(`/comments`);
  } catch (e) {
    next(e);
  }
});

export default comments;
