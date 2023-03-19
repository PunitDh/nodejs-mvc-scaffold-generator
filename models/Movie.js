import Model from '../bin/model.js'
import Theater from "./Theater.js";

class Movie extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.year = data.year;
    this.theater_id = data.theater_id;
  }

  get theater() {
    return Theater.find(this.id);
  }
}

export default Movie;