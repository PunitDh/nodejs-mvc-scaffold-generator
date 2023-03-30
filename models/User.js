import Model from "../bin/domain/Model.js";

class User extends Model {
  constructor(data = {}) {
    super(data);
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.password = data.password;
  }
}

export default User;
