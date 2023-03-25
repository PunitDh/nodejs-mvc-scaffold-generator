import Model from '../bin/domain/Model.js'

class Animal extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.color = data.color;
    this.image = data.image;
  }
}

export default Animal;