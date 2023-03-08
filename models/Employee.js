import Model from '../bin/model.js'

class Employee extends Model {
  constructor(data) {
    super(data);
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.title = data.title;
    this.salary = data.salary;
    this.sick_leave_hours = data.sick_leave_hours;
    this.annual_leave_hours = data.annual_leave_hours;
  }
}

export default Employee;