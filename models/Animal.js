import Model from "../bin/model.js";

class Animal extends Model {
  constructor(legs, eyes, name) {
    this.legs = legs;
    this.eyes = eyes;
    this.name = name;
  }
}

export default Animal;
