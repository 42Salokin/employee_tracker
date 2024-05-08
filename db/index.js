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

  // Queries the db to find all departments and returns name column as department_name to look better
  findAllDepartments() {
    return this.query('SELECT id, name AS department_name FROM department;');
}

  // Queries the db to find all roles, joins with departments to display the department name, changes some column names for appearance
  findAllRoles() {
    return this.query('SELECT role.id, role.title AS role_title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id;');
}

  // Queries the db to find all employees, joins with roles and departments to display their roles, salaries, departments, and managers
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

  // Queries the db to create a new department
  createDepartment(newDep) {
    pool.query('INSERT INTO department (name) VALUES ($1)', [newDep], function (err, result) {
      if (err) {
        console.error(err);
        return; 
    }
    })
  }

  // Queries the db to create a new role
  createRole(newRole, newSal, newDep) {
    pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))', 
    [newRole, newSal, newDep], function (err, result) {
        if (err) {
            console.error(err);
            return; 
        }
    });
}

  // Queries the db to find a role ID by the role title provided
  findRoleIdByTitle(roleName) {
    // Returns the promise directly from pool.query
    return pool.query('SELECT id FROM role WHERE title = $1', [roleName])
        .then(result => {
            // Checks if any rows were returned
            if (result.rows.length > 0) {
                // If rows were returned, returns the role ID 
                return result.rows[0].id;
            } else {
                return null;
            }
        })
        .catch(err => {
            throw err;
        });
}

// Queries the db to find an employee ID by the employee name provided
findEmployeeIdByName(firstName, lastName) {
  return pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [firstName, lastName])
      .then(result => {
          if (result.rows.length > 0) {
              return result.rows[0].id;
          } else {
              return null;
          }
      })
      .catch(err => {
          throw err;
      });
}

// Queries the db to create a new employee
  createEmployee(firstName, lastName, roleName, managerName) {
    // Separates the manager's full name into first and last names
    const [managerFirstName, managerLastName] = managerName.split(' ');
    // Gets role and manager IDs from the db
    Promise.all([db.findRoleIdByTitle(roleName), db.findEmployeeIdByName(managerFirstName, managerLastName)])
      .then(([roleId, managerId]) => {
        // Inserts the new employee into the employee table
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
  
  // Queries the db to update the given employee's role
updateEmployee(empName, newRole) {
      // Separates the employee's full name into first and last names
  const [firstName, lastName] = empName.split(' ');
    // Gets role and employee IDs from the db
  Promise.all([db.findRoleIdByTitle(newRole), db.findEmployeeIdByName(firstName, lastName)])
  .then (([roleId, empID]) => {
    // Changes the employee's current role ID to new role ID
    pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, empID], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
    });    
})
}

  // Queries the db to remove a department
  deleteDepartment(depDelete) {
    // Because the three tables are connected by PKs and FKs, have to start at the employee table and work thru to the department table
    // Deletes related records in the employee table
    pool.query('DELETE FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = (SELECT id FROM department WHERE name = $1))', [depDelete], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        // Deletes related records in the role table
        pool.query('DELETE FROM role WHERE department_id = (SELECT id FROM department WHERE name = $1)', [depDelete], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            // Deletes the department
            pool.query('DELETE FROM department WHERE name = $1', [depDelete], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    });
}

  // Queries the db to remove a role 
  deleteRole(roleDelete) {
    // Same thing as deleteDepartment, but now only have to delete from employee and role tables
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
  
  // Queries the db to remove an employee with the given id
deleteEmployee(empName) {
  const [firstName, lastName] = empName.split(' ');
  // Gets employee ID by the selected name
  db.findEmployeeIdByName(firstName, lastName)
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

// Creates an instance of DB that can be used to call functions within DB
const db = new DB();

module.exports = new DB();
