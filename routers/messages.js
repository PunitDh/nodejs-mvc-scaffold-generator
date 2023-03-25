import { Router } from "express";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import { Flash } from "../bin/constants.js";
const messages = Router();

messages.get("/", (req, res, next) => {
  try {
    const messages = Message.all();
    return res.render("messages/index", { messages });
  } catch (e) {
    next(e);
  }
});

messages.get("/new", (req, res, next) => {
  try {
    const message = new Message();
    const chats = Chat.all();
    return res.render("messages/new", { message, chats });
  } catch (e) {
    next(e);
  }
});

messages.post("/new", (req, res, next) => {
  try {
    const message = new Message(req.body);
    message.save();
    req.flash(Flash.SUCCESS, "Message has been added");
    return res.redirect(`/messages`);
  } catch (e) {
    next(e);
  }
});

messages.get("/edit/:id", (req, res, next) => {
  try {
    const message = Message.find(req.params.id);
    const chats = Chat.all();
    return res.render("messages/edit", { message, chats });
  } catch (e) {
    next(e);
  }
});

messages.post("/edit/:id", (req, res, next) => {
  try {
    Message.update(req.params.id, req.body);
    req.flash(Flash.SUCCESS, "Message has been updated");
    return res.redirect(`/messages`);
  } catch (e) {
    next(e);
  }
});

messages.post("/delete/:id", (req, res, next) => {
  try {
    Message.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Message has been deleted");
    return res.redirect("/messages");
  } catch (e) {
    next(e);
  }
});

messages.get("/:id", (req, res, next) => {
  try {
    const message = Message.find(req.params.id);
    return res.render("messages/message", { message: res.locals.marked(message) });
  } catch (e) {
    next(e);
  }
});

export default messages;
