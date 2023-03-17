import Model from '../bin/model.js'

class Movie extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.description = data.description;
    this.year = data.year;
    this.theater_id = data.theater_id;
  }
}

export default Movie;