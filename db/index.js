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
    return this.query('SELECT id, name AS department_name FROM department;');
}

  // TODO- Create a query to Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.query('SELECT role.id, role.title AS role_title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id;');
}

  // TODO- Create a query to Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.query(`
        SELECT e.first_name AS employee_first_name, e.last_name AS employee_last_name,
               r.title AS role_title, r.salary, d.name AS department_name,
               e2.first_name AS manager_first_name, e2.last_name AS manager_last_name
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee e2 ON e.manager_id = e2.id;
    `);
}


  // TODO- Create a query to Create a new department
  createDepartment(newDep) {
    pool.query('INSERT INTO department (name) VALUES ($1)', [newDep], function (err, result) {
      if (err) {
        console.error(err);
        return; // Exit early if there's an error
    }
    })
  }

  // TODO- Create a query to Create a new role
  createRole(newRole, newSal, newDep) {
    // Insert the new role into the role table
    pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))', 
    [newRole, newSal, newDep], function (err, result) {
        if (err) {
            console.error(err);
            return; // Exit early if there's an error
        }
    });
}

  // TODO- Create a query to Create a new employee
  findRoleIdByTitle(roleName) {
    // Return the promise directly from pool.query
    return pool.query('SELECT id FROM role WHERE title = $1', [roleName])
        .then(result => {
            // Check if any rows were returned
            if (result.rows.length > 0) {
                // If rows were returned, return the role ID (assuming it's in the first row)
                return result.rows[0].id;
            } else {
                // If no rows were returned (role not found), return null
                return null;
            }
        })
        .catch(err => {
            // If there's an error with the query, throw the error
            throw err;
        });
}

findEmployeeIdByName(firstName, lastName) {
  // Return the promise directly from pool.query
  return pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [firstName, lastName])
      .then(result => {
          // Check if any rows were returned
          if (result.rows.length > 0) {
              // If rows were returned, return the employee ID (assuming it's in the first row)
              return result.rows[0].id;
          } else {
              // If no rows were returned (employee not found), return null
              return null;
          }
      })
      .catch(err => {
          // If there's an error with the query, throw the error
          throw err;
      });
}


  createEmployee(firstName, lastName, roleName, managerName) {
    const [managerFirstName, managerLastName] = managerName.split(' ');
    // Get role and manager IDs from the database
    Promise.all([db.findRoleIdByTitle(roleName), db.findEmployeeIdByName(managerFirstName, managerLastName)])
      .then(([roleId, managerId]) => {
        // Insert the new employee into the employee table
        const query = `
          INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES ($1, $2, $3, $4)
        `;
        const values = [firstName, lastName, roleId, managerId];
        
        return this.query(query, values);
      })
      .catch(err => {
        console.error(err);
      });
  }
  
  // TODO- Create a query to Update the given employee's role
updateEmployee(empName, newRole) {
  const [firstName, lastName] = empName.split(' ');

  Promise.all([db.findRoleIdByTitle(newRole), db.findEmployeeIdByName(firstName, lastName)])
  .then (([roleId, empID]) => {
    pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, empID], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
    });    
})
}

  // BONUS- Create a query to Remove a department
  deleteDepartment(depDelete) {
    // First, delete related records in the employee table
    pool.query('DELETE FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = (SELECT id FROM department WHERE name = $1))', [depDelete], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        // Now that the related records in the employee table are deleted, 
        // delete related records in the role table
        pool.query('DELETE FROM role WHERE department_id = (SELECT id FROM department WHERE name = $1)', [depDelete], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            // Now that the related records in the role table are deleted, 
            // delete the department
            pool.query('DELETE FROM department WHERE name = $1', [depDelete], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    });
}

  // BONUS- Create a query to Remove a role from the db
  deleteRole(roleDelete) {
    pool.query('DELETE FROM employee WHERE role_id = (SELECT id FROM role WHERE title = $1)', [roleDelete], (err, result) => {
      if (err) {
          console.error(err);
          return;
      }
      pool.query('DELETE FROM role WHERE title = $1', [roleDelete], (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  }
  
  // BONUS- Create a query to Remove an employee with the given id
deleteEmployee(empName) {
  const [firstName, lastName] = empName.split(' ');
  this.findEmployeeIdByName(firstName, lastName)
  .then ((empID) => {
    pool.query('DELETE FROM employee WHERE id = $1', [empID], (err, result) => {
      if (err) {
      console.error(err);
      return;
      }
    });
  });
}











}

const db = new DB();

module.exports = new DB();
