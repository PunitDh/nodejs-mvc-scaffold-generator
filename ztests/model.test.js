import Message from "../models/Message.js";
import "../bin/utils/js_utils.js";
import { parseWhereArgs } from "../bin/utils/model_utils.js";
import Model from "../bin/domain/Model.js";
import Animal from "../models/Animal.js";

console.log(
  // Message.where({
  //   id: { ">": 5, $lt: 8 },
  //   role: ["user", "assistant"],
  //   tokens: { $gt: 10 },
  // }),
  // Message.findBy({ id: { $gt: 5 } }),
  // Message.findBy({ id: { $in: { $gt: { $lt: 5 } } } })
  Message.find(5)
);

const expected = {
  columns: ["id in ($id0, $id1, $id2)", "role=$role"],
  values: { id0: 5, id1: 6, id2: 7, role: "user" },
};
