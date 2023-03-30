import { Router } from "express";
import Chat from "../models/Chat.js";
import { Flash } from "../bin/constants.js";
import Message from "../models/Message.js";
import openai from "../plugins/openai.js";
import csrf from "../bin/middleware/csrf.js";
const chats = Router();

chats.use(csrf());

chats.get("/", (req, res, next) => {
  try {
    const chats = Chat.all();
    return res.render("chats/index", { chats });
  } catch (e) {
    next(e);
  }
});

chats.get("/new", (req, res, next) => {
  try {
    const chat = new Chat();
    return res.render("chats/new", { chat });
  } catch (e) {
    next(e);
  }
});

chats.post("/new", (req, res, next) => {
  try {
    const chat = new Chat(req.body);
    chat.save();
    req.flash(Flash.SUCCESS, "Chat has been added");
    return res.redirect(`/chats`);
  } catch (e) {
    next(e);
  }
});

chats.get("/edit/:id", (req, res, next) => {
  try {
    const chat = Chat.find(req.params.id);
    return res.render("chats/edit", { chat });
  } catch (e) {
    next(e);
  }
});

chats.post("/edit/:id", (req, res, next) => {
  try {
    Chat.update(req.params.id, req.body);
    req.flash(Flash.SUCCESS, "Chat has been updated");
    return res.redirect(`/chats`);
  } catch (e) {
    next(e);
  }
});

chats.post("/delete/:id", (req, res, next) => {
  try {
    Chat.delete(req.params.id);
    req.flash(Flash.SUCCESS, "Chat has been deleted");
    return res.redirect("/chats");
  } catch (e) {
    next(e);
  }
});

chats.get("/:id", (req, res, next) => {
  try {
    const chat = Chat.find(req.params.id);
    const messages = chat.messages
      .map((message) => message.exclude("id", "updated_at", "chat_id"))
      .tail(10);
    return res.render("chats/chat", { chat, messages });
  } catch (e) {
    next(e);
  }
});

chats.post("/message", async (req, res, next) => {
  try {
    const message = new Message(req.body);
    const response = await openai.completeWithDaVinci(req.body.content);
    const { prompt_tokens, completion_tokens, model } = response;
    message.tokens = prompt_tokens;
    const answer = new Message({
      role: "assistant",
      content: response.answer,
      tokens: completion_tokens,
      chat_id: req.body.chat_id,
      model,
    });
    message.save();
    answer.save();
    req.flash(Flash.SUCCESS, "Message has been added");
    return res.redirect(`/chats/${req.body.chat_id}`);
  } catch (e) {
    next(e);
  }
});

export default chats;
