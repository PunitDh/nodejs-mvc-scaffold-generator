import Model from '../bin/model.js'

class Animal extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.color = data.color;
  }
}

export default Animal;