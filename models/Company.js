import Model from "../bin/model.js";
import Employee from "./Employee.js";

class Company extends Model {
  constructor(data = {}) {
    super(data);
    this.name = data.name;
    this.address = data.address;
    this.number_of_employees = data.number_of_employees;
  }

  get employees() {
    return Employee.where({ employer_id: this.id });
  }
}

export default Company;
