const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { type } = require("os");

init();

// Displays logo text
function init() {
  const logoText = logo({ name: "Employees of Middle Earth" }).render();

  console.log(logoText);

  loadMainPrompts();
}

// Displays the starter prompt, calls a function for each choice
function loadMainPrompts() {
  prompt([
    {
      type: 'list',
      name: 'doList',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Delete Department', 'Delete Role', 'Delete Employee', 'Nothing'],
    },
  ])
    .then((res) => {
      const choice = res.doList;
      switch (choice) {
        case 'View All Departments':
          viewDepartments();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add a Department':
          addDepartment();
          break;
        case 'Add a Role':
          addRole();
          break;
        case 'Add an Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateRole();
          break;
        case 'Delete Department':
          deleteDepartment();
          break;
        case 'Delete Role':
          deleteRole();
          break;
        case 'Delete Employee':
          deleteEmployee();
          break;
        default:
          quit();
          break;
      }
    });
}

// Calls the query function to find departments, displays the result in a table
function viewDepartments() {
  db.findAllDepartments()
  .then(({rows}) => {
    console.table(rows);
    loadMainPrompts();
  })  
}

// Calls the query function to find roles, displays the result in a table
function viewRoles() {
  db.findAllRoles()
  .then(({rows}) => {
    console.table(rows);
    loadMainPrompts();
  })
}

// Calls the query function to find employees, displays the result in a table
function viewEmployees() {
  db.findAllEmployees()
  .then(({rows}) => {
    console.table(rows);
    loadMainPrompts();
  })
}

// Displays a prompt to get the name of new department, sends choice to query function to add to department table
function addDepartment() {
  prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?'
    }
  ])
    .then((res) => {
      const newDep = res.department;
      db.createDepartment(newDep);
      console.log(`${newDep} added to departments`);
    })
    .then(() => {
      loadMainPrompts();
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

// Gets all departments for list, displays a prompt to get the name of new role, salary, and department,
//  sends answers to query function to add to role table
function addRole() {
  return db.findAllDepartments()
    .then(({rows}) => {
      const departments = rows.map(dep => dep.department_name);
      return prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'What is the name of the role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: "What is the role's salary?"
        },
        {
          type: 'list',
          name: 'department',
          message: 'Which department is the role in?',
          choices: departments
        },
      ]);
    })
    .then((res) => {
      const newRole = res.roleName;
      const newSal = res.salary;
      const newDep = res.department;
      db.createRole(newRole, newSal, newDep);
      console.log(`${newRole}, making ${newSal} per year, has been added to ${newDep}`);
    })
    .then(() => {
      loadMainPrompts();
    })
    .catch(err => {
      console.error('Error:', err);
    });
}


// Gets all roles and employees for lists, displays a prompt to get the name of new employee's first name, last name, role, and department,
//  sends answers to query function to add to employee table
function addEmployee() {
  Promise.all([db.findAllRoles(), db.findAllEmployees()])
    .then(([roles, managers]) => {
      const roleChoices = roles.rows.map(role => role.role_title);
      const managerNames = new Set(managers.rows.map(manager => `${manager.manager_first_name} ${manager.manager_last_name}`));
      const managerChoices = [...managerNames];

      return prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name?"
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name?"
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: [...managerChoices]
        },
      ]);
    })
    .then((res) => {
      const firstName = res.firstName;
      const lastName = res.lastName;
      const empRole = res.role;
      const empManager = res.manager;

      db.createEmployee(firstName, lastName, empRole, empManager);
      console.log(`${firstName} ${lastName} has been added in the role of ${empRole}, answering to ${empManager}`);
    })
    .then(() => {
      loadMainPrompts();
    })
    .catch(err => {
      console.error('Error:', err);
    });
}


// Gets all roles and employees for lists, displays a prompt to choose existing employee and select a new role for them,
//  sends answers to query function to update employee table
function updateRole() {
  Promise.all([db.findAllRoles(), db.findAllEmployees()])
  .then(([roles, employees]) => {
    const roleChoices = roles.rows.map(role => role.role_title);
    const employeeNames = new Set(employees.rows.map(employee => `${employee.employee_first_name} ${employee.employee_last_name}`));
    const employeeChoices = [...employeeNames];

    return prompt([
      {
        type: 'list',
        name: 'employee',
        message: "Which employee's role would you like to update?",
        choices: [...employeeChoices]
      },
      {
        type: 'list',
        name: 'role',
        message: "Which new role would you like to give that employee?",
        choices: roleChoices
      },      
    ]);
  })
  .then((res) => {
    const empName = res.employee;
    const newRole = res.role;
    db.updateEmployee(empName, newRole);
    console.log(`${empName}'s role was updated to ${newRole}`);
  })
  .then(() => {
    loadMainPrompts();
  })
  .catch(err => {
    console.error('Error:', err);
  });
}

// Gets all departments for list, displays a prompt to get the department to delete,
//  sends choice to query function to delete from department table
function deleteDepartment() {
  return db.findAllDepartments()
    .then(({rows}) => {
      const departments = rows.map(dep => dep.department_name);
      return prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Which department do you want to delete?',
          choices: departments
        },
      ]);
    })
    .then((res) => {
      const depDelete = res.department;
      db.deleteDepartment(depDelete);
      console.log(`${depDelete} has been deleted`);
    })
    .then(() => {
      loadMainPrompts();
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

// Gets all roles for list, displays a prompt to get the role to delete,
//  sends choice to query function to delete from role table
function deleteRole() {
  return db.findAllRoles()
  .then(({rows}) => {
    const roles = rows.map(role => role.role_title);
    return prompt([
      {
        type: 'list',
        name: 'role',
        message: 'Which role do you want to delete?',
        choices: roles
      },
    ]);
  })
  .then((res) => {
    const roleDelete = res.role;
    db.deleteRole(roleDelete);
    console.log(`${roleDelete} has been deleted`);
  })
  .then(() => {
    loadMainPrompts();
  })
  .catch(err => {
    console.error('Error:', err);
  });
}

// Gets all employees for list, displays a prompt to get the employee to delete,
//  sends choice to query function to delete from employee table
function deleteEmployee() {
    return db.findAllEmployees()
    .then((employees) => {
      const employeeNames = new Set(employees.rows.map(employee => `${employee.employee_first_name} ${employee.employee_last_name}`));
      const employeeChoices = [...employeeNames];
  
      return prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee would you like to delete?",
          choices: [...employeeChoices]
        },     
      ]);
    })
    .then((res) => {
      const empName = res.employee;
      db.deleteEmployee(empName);
      console.log(`${empName} has been deleted`);
    })
    .then(() => {
      loadMainPrompts();
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

// Exits the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
