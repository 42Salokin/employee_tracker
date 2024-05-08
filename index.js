const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { type } = require("os");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employees of Middle Earth" }).render();

  console.log(logoText);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: 'list',
      name: 'doList',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Nothing'],
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
        default:
          quit();
          break;
      }
    });
}

function viewDepartments() {
  db.findAllDepartments()
  .then(({rows}) => {
    console.table(rows);
  })
}

function viewRoles() {
  db.findAllRoles()
  .then(({rows}) => {
    console.table(rows);
  })
}

// TODO- Create a function to View all employees
function viewEmployees() {
  db.findAllEmployees()
  .then(({rows}) => {
    console.table(rows);
  })
}

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
    });
}

// TODO- Create a function to Add a role
function addRole() {
  return db.findAllDepartments()
    .then(({rows}) => {
      const departments = rows.map(dep => dep.name);
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
      return db.createRole(newRole, newSal, newDep);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}


// TODO- Create a function to Add an employee
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
          choices: [...managerChoices, 'None']
        },
      ]);
    })
    .then((res) => {
      const firstName = res.firstName;
      const lastName = res.lastName;
      const empRole = res.role;
      const empManager = res.manager === 'None' ? null : res.manager;

      db.createEmployee(firstName, lastName, empRole, empManager);
    })
    .catch(err => {
      console.error('Error:', err);
    });
}


// TODO- Create a function to Update an employee's role
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
  })
  .catch(err => {
    console.error('Error:', err);
  });
}

// BONUS- Create a function to View all employees that belong to a department

// BONUS- Create a function to View all employees that report to a specific manager

// BONUS- Create a function to Delete an employee

// BONUS- Create a function to Update an employee's manager

// BONUS- Create a function to Delete a role

// BONUS- Create a function to Delete a department

// BONUS- Create a function to View all departments and show their total utilized department budget

// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
