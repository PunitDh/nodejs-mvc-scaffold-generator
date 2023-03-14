import app from "./bin/app.js";

import pages from "./routers/pages.js";
app.use("/", pages);
