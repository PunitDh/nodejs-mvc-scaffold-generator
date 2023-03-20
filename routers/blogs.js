import { Router } from "express";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import authenticated from "../bin/middleware/authenticated.js";
import csrf from "../bin/middleware/csrf.js";
const blogs = Router();

blogs.use(authenticated);
blogs.use(csrf());

blogs.get("/", (req, res, next) => {
  try {
    const blogs = Blog.all();
    return res.render("blogs/index", { blogs });
  } catch (e) {}
});

blogs.get("/new", (req, res, next) => {
  try {
    const blog = new Blog();
    return res.render("blogs/new", { blog });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/blogs");
  }
});

blogs.get("/edit/:id", (req, res, next) => {
  try {
    const blog = Blog.find(req.params.id);
    return res.render("blogs/edit", { blog });
  } catch (e) {
    req.flash("error", e.message);
  }
});

blogs.post("/edit/:id", (req, res, next) => {
  try {
    Blog.update(req.params.id, req.body);
    req.flash("success", "Blog has been updated");
    return res.redirect(`/blogs`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect(`/blogs/edit/${req.params.id}`);
  }
});

blogs.post("/delete/:id", (req, res, next) => {
  try {
    Blog.delete(req.params.id);
    req.flash("success", "Blog has been deleted");
    return res.redirect("/blogs");
  } catch (e) {
    next(e);
  }
});

blogs.get("/:id", (req, res, next) => {
  try {
    const blog = Blog.find(req.params.id);
    const comments = (blog.comments).map((comment) =>
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

blogs.post("/new", (req, res, next) => {
  try {
    Blog.create(req.body);
    req.flash("success", "Blog has been added");
    return res.redirect(`/blogs`);
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/blogs/new");
  }
});

blogs.post("/comment", (req, res, next) => {
  try {
    Comment.create(req.body);
    req.flash("success", "Comment has been added");
    return res.redirect(`/blogs/${req.body.blog_id}`);
  } catch (e) {
    req.flash("error", e.message);
  }
});

export default blogs;
