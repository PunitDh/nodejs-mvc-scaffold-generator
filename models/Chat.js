import Model from "../bin/domain/Model.js";
import Message from "./Message.js";

class Chat extends Model {
  constructor(data = {}) {
    super(data);
    this.title = data.title;
  }

  get messages() {
    return Message.where({ chat_id: this.id });
  }
}

export default Chat;
