import Model from '../bin/model.js'

class Theater extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.location = data.location;
  }
}

export default Theater;