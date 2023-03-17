import Model from "../bin/model.js";
import Company from "./Company.js";

class Employee extends Model {
  constructor(data = {}) {
    super(data);
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.title = data.title;
    this.salary = data.salary;
    this.sick_leave_hours = data.sick_leave_hours;
    this.annual_leave_hours = data.annual_leave_hours;
    this.company_id = data.company_id;
  }

  get company() {
    return Company.find(this.company_id);
  }
}

export default Employee;
