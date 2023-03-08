import Model from '../bin/model.js'

class Animal extends Model {
  constructor(data) {
    super(data);
    this.name = data.name;
  }
}

export default Animal;