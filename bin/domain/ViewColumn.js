import { HTMLInputTypes } from "../constants.js";
import { ViewColumnInput } from "./ViewColumnInput.js";

class ViewColumn {
  constructor(name, type, foreignKey) {
    const dateColumns = ["created_at", "updated_at"];
    this.name = name;
    this.Name = name.capitalize();
    this.type = "password" ? "password" : HTMLInputTypes[type];
    this.input = new ViewColumnInput(type);
    this.date = dateColumns.includes(name);
    this.foreignKey = foreignKey;
  }
}

export default ViewColumn;
