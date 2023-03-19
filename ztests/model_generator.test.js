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

await generateModel(
  "npm run model:generate Comment Blog:references:onDelete:SetNull body:string:notnull count:integer:default:1 User:references:ondelete:restrict:onupdate:setdefault"
);
