import Model from "../bin/domain/Model.js";
import Movie from "./Movie.js";

class Theater extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.location = data.location;
  }

  get movies() {
    return Movie.where({ theater_id: this.id });
  }
}

export default Theater;
