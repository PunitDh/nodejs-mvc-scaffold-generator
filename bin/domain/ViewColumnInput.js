
export class ViewColumnInput {
  constructor(type) {
    this.class = type !== "checkbox" ? "form-control" : "";
    this.type = type;
  }
}
