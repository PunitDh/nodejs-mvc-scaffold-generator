import Model from "../bin/domain/Model.js"

class Theater extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.location = data.location;
  }
}

export default Theater;