import { TERMINAL_COLORS } from "../bin/constants.js";
import Handlebars from "../bin/utils/handlebars.js";

const logMessage = Handlebars.compileFile(
  "./bin/templates/logger/message.template"
)({
  method: "GET",
  path: '/users',
  dateTime: new Date().toUTCString(),
  router: "users",
  action: "get",
  body: JSON.stringify({id: 1, name: "Test", legs: 3}),
  file: "users.js",
  line: 230,
  query: {
    action: "Load",
    string: "SELECT * FROM users WHERE email=$email",
    values: ["test@test.com"],
    color: TERMINAL_COLORS.FgBlue
  },
  model: "User",
  redirect: "/blogs",
  statusCode: 200,
  statusText: "OK",
  time: 9,
}).split("\n");

console.log(logMessage.join("\n"));
