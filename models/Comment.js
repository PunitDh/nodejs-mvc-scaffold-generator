import Model from "../bin/model.js";
import Blog from "./Blog.js";

class Comment extends Model {
  constructor(data) {
    super(data);
    this.blog_id = data.blog_id;
    this.body = data.body;
  }

  get blog() {
    return Blog.find(this.blog_id);
  }
}

export default Comment;
