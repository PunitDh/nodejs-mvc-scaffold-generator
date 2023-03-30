import Model from "../bin/domain/Model.js";
import Theater from "./Theater.js";

class Movie extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.year = data.year;
    this.theater_id = data.theater_id;
  }

  get theater() {
    return Theater.find(this.theater_id);
  }
}

export default Movie;
