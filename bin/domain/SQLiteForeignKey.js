import { getModelNameFromTable } from "../utils/model_utils.js";

class SQLiteForeignKey {
  constructor({ id, seq, table, from, to, on_update, on_delete, match } = {}) {
    this.id = id;
    this.seq = seq;
    this.table = table;
    this.Model = getModelNameFromTable(table);
    this.model = this.Model.toLowerCase();
    this.from = from;
    this.to = to;
    this.onUpdate = on_update;
    this.onDelete = on_delete;
    this.match = match;
  }
}

export default SQLiteForeignKey;
