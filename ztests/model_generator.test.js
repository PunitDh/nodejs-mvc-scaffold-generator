// """
// Generate a model
// -----------------------------------------------------------------
// npm run model:generate Animal legs:number eyes:number name:string
//
//
// Generate a User model with unique email
// ---------------------------------------
// npm run model:generate User firstname:string lastname:string email:string:unique password:string is_admin:boolean
//
// Generate models Blog and Comment, with a foreign key in Comment blog_id referencing a blog
// ------------------------------------------------------------------------------------------
// npm run model:generate Blog title:string body:string
// npm run model:generate Comment Blog:references body:string
// npm run model:generate Comment Blog:references:blog_id body:string
//
// """

import "../bin/utils/js_utils.js";
import { generateModel } from "../bin/generators/model_generator.js";
import { assertEquals } from "../bin/test/test_utils.js";

// const actual = generateModel(
//   "npm run model:generate Comment Blog:references:onDelete:SetNull body:string:notnull count:integer:default:1 User:references:ondelete:restrict:onupdate:setdefault"
// );

// const expected = `CREATE TABLE IF NOT EXISTS comments (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   body TEXT NOT NULL,
//   count INTEGER DEFAULT 1,
//   blog_id INTEGER,
//   user_id INTEGER,
//   created_at NUMERIC DEFAULT (DATETIME('NOW')),
//   updated_at NUMERIC DEFAULT (DATETIME('NOW')),
//   FOREIGN KEY(blog_id) REFERENCES blogs(id) ON DELETE SET NULL ON UPDATE CASCADE,
//   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE SET DEFAULT
// );`

// assertEquals("should create comments table with correct foreign keys", expected, actual);

const sneaker = generateModel(
  "npm run scaffold:generate Sneaker name:string color:string Shop:references"
);

console.log(sneaker);
