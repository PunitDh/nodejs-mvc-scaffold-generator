import { Router } from "express";
import Fish from "../models/Fish.js";
import csrf from "../bin/middlewares/csrf.js";
import authorize from "../bin/middlewares/authorize.js";
const fish = Router();

// fish.use(csrf);

// fish.get("/", async (_, res) => {
//   try {
//     const fish = await Fish.all();
//     res.render("fish/index", { fish, _csrf: res.locals._csrf });
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// fish.get("/new", authorize, async (_, res) => {
//   try {
//     res.render("fish/new", { _csrf: res.locals._csrf });
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// fish.get("/edit/:id", authorize, async (req, res) => {
//   try {
//     console.log(res.locals._csrf);
//     const { id } = req.params;
//     const fish = (await Fish.find(id))[0];
//     return res.render("fish/edit", { fish, _csrf: res.locals._csrf });
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// fish.post("/edit/:id", authorize, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { _csrf, ...body } = req.body;
//     await Fish.update(id, body);
//     return res.redirect("/fish");
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// fish.post("/delete/:id", authorize, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Fish.delete(id);
//     return res.redirect("/fish");
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// fish.get("/:id", authorize, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const fish = await Fish.find(id);
//     return res.status(200).send(fish);
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

// fish.post("/", authorize, async (req, res) => {
//   try {
//     const { _csrf, ...body } = req.body;
//     await Fish.create(body);
//     return res.redirect("/fish");
//   } catch (e) {
//     return res.status(400).send(e.message);
//   }
// });

export default fish;
