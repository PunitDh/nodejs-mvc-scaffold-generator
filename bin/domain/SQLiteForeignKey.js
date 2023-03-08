class SQLiteForeignKey {
  constructor({ id, seq, table, from, to, on_update, on_delete, match }) {
    this.id = id;
    this.seq = seq;
    this.table = table;
    this.from = from;
    this.to = to;
    this.on_update = on_update;
    this.on_delete = on_delete;
    this.match = match;
  }
}

export default SQLiteForeignKey;