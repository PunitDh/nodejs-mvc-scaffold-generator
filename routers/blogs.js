import { Router } from "express";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import authenticated from "../bin/middleware/authenticated.js";
import csrf from "../bin/middleware/csrf.js";
const blogs = Router();

blogs.use(authenticated);
blogs.use(csrf());

blogs.get("/", async (req, res) => {
  try {
    const blogs = await Blog.all();
    return res.render("blogs/index", { blogs });
  } catch (e) {}
});

blogs.get("/new", async (req, res) => {
  try {
    return res.render("blogs/new");
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/blogs");
  }
});

blogs.get("/edit/:id", async (req, res) => {
  try {
    const blog = await Blog.find(req.params.id);
    return res.render("blogs/edit", { blog });
  } catch (e) {
    req.flash("error", e.message);
  }
});

blogs.post("/edit/:id", async (req, res) => {
  try {
    await Blog.update(req.params.id, req.body);
    req.flash("success", "Blog has been updated");
    return res.redirect(`/blogs`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect(`/blogs/edit/${req.params.id}`);
  }
});

blogs.post("/delete/:id", async (req, res) => {
  try {
    await Blog.delete(req.params.id);
    req.flash("success", "Blog has been deleted");
    return res.redirect("/blogs");
  } catch (e) {
    req.flash("error", e.message);
  }
});

blogs.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.find(req.params.id);
    const comments = (await blog.comments).map((comment) =>
      comment.exclude("id", "blog_id", "updated_at")
    );
    return res.render("blogs/blog", {
      blog: res.locals.marked(blog),
      comments: comments.map((comment) => res.locals.marked(comment)),
    });
  } catch (e) {
    req.flash("error", e.message);
  }
});

blogs.post("/new", async (req, res) => {
  try {
    await Blog.create(req.body);
    req.flash("success", "Blog has been added");
    return res.redirect(`/blogs`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/blogs/new");
  }
});

blogs.post("/comment", async (req, res) => {
  try {
    await Comment.create(req.body);
    req.flash("success", "Comment has been added");
    return res.redirect(`/blogs/${req.body.blog_id}`);
  } catch (e) {
    req.flash("error", e.message);
  }
});

export default blogs;
