import Model from "../bin/model.js";
import Comment from "./Comment.js";

class Blog extends Model {
  constructor(data = {}) {
    super(data);
    this.title = data.title;
    this.body = data.body;
  }

  get comments() {
    return Comment.where({ blog_id: this.id });
  }
}

export default Blog;
