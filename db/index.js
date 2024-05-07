const pool = require("./connection");

class DB {
  constructor() {}

  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  // TODO- Create a query to Find all departments
  findAllDepartments() {
    return this.query('SELECT * FROM department;')
  }

  // TODO- Create a query to Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.query('SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.id = department.id;')
    }

  // TODO- Create a query to Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM role JOIN department ON role.id = department.id JOIN employee ON role.id = employee.role_id;')  
  }

  // TODO- Create a query to Create a new department
  createDepartment(newDep) {
    pool.query('INSERT INTO department (name) VALUES ($1)', [newDep], function (err, {rows}) {
      console.log(`${newDep} added to departments`);
    })
  }

  // TODO- Create a query to Create a new role
  createRole(newRole, newSal, newDep) {
    pool.query('SELECT $1 FROM department', [newDep], function (err, {rows}) {
      switch (newDep) {
        case value:
          
          break;
      
        default:
          break;
      }
    })
    pool.query('INSERT INTO role (title, salary) VALUES ($1)', [newDep], function (err, {rows}) {
      console.log(`${newRole}, making ${newSal} per year, has been added to ${newDep}`);
    })
  }

  // TODO- Create a query to Find all employees except the given employee id

  // TODO- Create a query to Create a new employee

  // BONUS- Create a query to Remove an employee with the given id

  // TODO- Create a query to Update the given employee's role

  // BONUS- Create a query to Update the given employee's manager


  // BONUS- Create a query to Remove a role from the db

  // BONUS- Create a query to Find all departments, join with employees and roles and sum up utilized department budget

  // BONUS- Create a query to Remove a department

  // BONUS- Create a query to Find all employees in a given department, join with roles to display role titles

  // BONUS- Create a query to Find all employees by manager, join with departments and roles to display titles and department names
}

module.exports = new DB();
