import { Router } from "express";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import authenticated from "../bin/middleware/authenticated.js";
import csrf from "../bin/middleware/csrf.js";
import { Flash } from "../bin/constants.js";
const blogs = Router();

blogs.use(authenticated);
blogs.use(csrf());

blogs.get("/", (req, res, next) => {
  try {
    const blogs = Blog.all();
    return res.render("blogs/index", { blogs });
  } catch (e) {
    next(e);
  }
});

blogs.get("/new", (req, res, next) => {
  try {
    const blog = new Blog();
    return res.render("blogs/new", { blog });
  } catch (e) {
    next(e);
  }
});

blogs.get("/edit/:id", (req, res, next) => {
  try {
    const blog = Blog.find(req.params.id);
    return res.render("blogs/edit", { blog });
  } catch (e) {
    next(e);
  }
});

blogs.post("/edit/:id", (req, res, next) => {
  try {
    Blog.update(req.params.id, req.body);
    req.flash(Flash.SUCCESS, "Blog has been updated");
    return res.redirect(`/blogs`);
  } catch (e) {
    next(e);
  }
});

blogs.post("/delete/:id", (req, res, next) => {
  try {
    Blog.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Blog has been deleted");
    return res.redirect("/blogs");
  } catch (e) {
    next(e);
  }
});

blogs.get("/:id", (req, res, next) => {
  try {
    const blog = Blog.find(req.params.id);
    const comments = blog?.comments.map((comment) =>
      comment.exclude("id", "blog_id", "updated_at")
    );
    return res.render("blogs/blog", {
      blog: res.locals.marked(blog),
      comments: comments.map((comment) => res.locals.marked(comment)),
    });
  } catch (e) {
    next(e);
  }
});

blogs.post("/new", (req, res, next) => {
  try {
    Blog.create(req.body);
    req.flash(Flash.SUCCESS, "Blog has been added");
    return res.redirect(`/blogs`);
  } catch (e) {
    next(e);
  }
});

blogs.post("/comment", (req, res, next) => {
  try {
    Comment.create(req.body);
    req.flash(Flash.SUCCESS, "Comment has been added");
    return res.redirect(`/blogs/${req.body.blog_id}`);
  } catch (e) {
    next(e);
  }
});

export default blogs;
