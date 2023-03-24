import { TERMINAL_COLORS } from "../bin/constants.js";
import Handlebars from "../bin/utils/handlebars.js";

const logMessage = Handlebars.compileFile(
  "./bin/templates/logger/message.handlebars"
)({
  method: "GET",                                            // req.method
  path: "/users",                                           // req.url
  dateTime: new Date().toUTCString(),                       // new Date()
  router: "users",                                          // req.path
  action: "get",                                            // req.method.toLowerCase()
  body: JSON.stringify({ id: 1, name: "Test", legs: 3 }),   // req.body
  file: "users.js",                                         // ???
  line: 230,                                                // ???
  query: {                                                  // ???
    action: "Load",
    string: "SELECT * FROM users WHERE email=$email",
    values: ["test@test.com"],
    color: TERMINAL_COLORS.FgBlue,
  },
  model: "User",
  redirect: "/blogs",
  statusCode: 200,                                           // res.statusCode
  statusText: "OK",                                          // res.statusText
  time: 9,                                                   // process.hrtime
  resetColor: TERMINAL_COLORS.Reset,
}).split("\n");

console.log(logMessage.join("\n"));
