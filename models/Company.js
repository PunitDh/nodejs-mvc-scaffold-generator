import Model from "../bin/model.js";

class Company extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.address = data.address;
    this.number_of_employees = data.number_of_employees;
  }
}

export default Company;
