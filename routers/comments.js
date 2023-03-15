import { Router } from "express";
import Comment from "../models/Comment.js";
import csrf from "../bin/middleware/csrf.js";
import Blog from "../models/Blog.js";
const comments = Router();

comments.use(csrf());

comments.get("/", async (req, res) => {
  try {
    const comments = await Comment.all();
    return res.render("comments/index", { comments });
  } catch (e) {}
});

comments.get("/new", async (req, res) => {
  try {
    const blogs = await Blog.all();
    const comment = new Comment();
    return res.render("comments/new", { comment, blogs });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/comments");
  }
});

comments.get("/edit/:id", async (req, res) => {
  try {
    const comment = await Comment.find(req.params.id);
    const blogs = await Blog.all();
    return res.render("comments/edit", { comment, blogs });
  } catch (e) {
    req.flash("error", e.message);
  }
});

comments.post("/edit/:id", async (req, res) => {
  try {
    await Comment.update(req.params.id, req.body);
    req.flash("success", "Comment has been updated");
    return res.redirect(`/comments`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect(`/comments/edit/${req.params.id}`);
  }
});

comments.post("/delete/:id", async (req, res) => {
  try {
    await Comment.delete(req.params.id);
    req.flash("success", "Comment has been deleted");
    return res.redirect("/comments");
  } catch (e) {
    req.flash("error", e.message);
  }
});

comments.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.find(req.params.id);
    return res.render("comments/comment", { comment });
  } catch (e) {
    req.flash("error", e.message);
  }
});

comments.post("/new", async (req, res) => {
  try {
    await Comment.create(req.body);
    req.flash("success", "Comment has been added");
    return res.redirect(`/comments`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("comments/new");
  }
});

export default comments;
