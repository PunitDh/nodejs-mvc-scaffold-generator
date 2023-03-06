import app from "./bin/app.js";

import pages from "./routers/pages.js";
app.use("/", pages);

import users from "./routers/users.js";
app.use("/users", users);


import animals from "./routers/animals.js";
app.use("/animals", animals);

import blogs from "./routers/blogs.js";
app.use("/blogs", blogs);
import comments from "./routers/comments.js";
app.use("/comments", comments);
