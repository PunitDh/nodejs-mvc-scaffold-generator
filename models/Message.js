import Model from "../bin/domain/Model.js";
import Chat from "./Chat.js";

class Message extends Model {
  constructor(data = {}) {
    super(data);
    this.role = data.role;
    this.content = data.content;
    this.tokens = data.tokens;
    this.chat_id = data.chat_id;
  }

  get chat() {
    return Chat.find(this.chat_id);
  }
}

export default Message;
