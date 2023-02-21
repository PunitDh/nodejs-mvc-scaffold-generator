import app from "./bin/app.js";

import todos from "./routers/todos.js";
app.use("/todos", todos);

import animals from "./routers/animals.js";
app.use("/animals", animals);

import users from "./routers/users.js";
app.use("/users", users);

import houses from "./routers/houses.js";
app.use("/houses", houses);
