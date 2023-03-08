import { Router } from "express";
import Comment from "../models/Comment.js";
const comments = Router();

comments.get("/", async (req, res) => {
  try {
    const comments = await Comment.all();
    return res.render("comments/index", { comments });
  } catch (e) {}
});

comments.get("/create", async (req, res) => {
  try {
    return res.render("comments/create");
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/comments");
  }
});

comments.get("/edit/:id", async (req, res) => {
  try {
    const comment = await Comment.find(req.params.id);
    return res.render("comments/edit", { comment });
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

comments.post("/", async (req, res) => {
  try {
    await Comment.create(req.body);
    req.flash("success", "Comment has been added");
    return res.redirect(`/comments`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("comments/create");
  }
});

export default comments;
