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
    // TODO- Create first question user will see- "What would you like to do?"
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

// TODO- Create a function to View all deparments
function viewDepartments() {
  console.log('Here are all departments');
}

// TODO- Create a function to View all roles
function viewRoles() {
  console.log('Here are all roles');
}

// TODO- Create a function to View all employees
function viewEmployees() {
  db.findAllEmployees();
}

// TODO- Create a function to Add a department
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
      console.log(newDep);
    });
}

// TODO- Create a function to Add a role
function addRole() {
  prompt([
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
      type: 'input',
      name: 'department',
      message: 'Which department is the role in?'
    },
  ])
    .then((res) => {
      const newRole = res.roleName;
      const newSal = res.salary;
      const newDep = res.department;
      console.log(`${newRole}, making ${newSal} per year, has been added to ${newDep}`);
    });
}

// TODO- Create a function to Add an employee
function addEmployee() {
  prompt([
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
      type: 'input',
      name: 'role',
      message: "What is the employee's role?"
    },
    {
      type: 'input',
      name: 'manager',
      message: "Who is the employee's manager?"
    },
  ])
    .then((res) => {
      const firstName = res.firstName;
      const lastName = res.lastName;
      const empRole = res.role;
      const empManager = res.manager;
      console.log(`${firstName} ${lastName} has been added in the role of ${empRole}, answering to ${empManager}`);
    });}

// TODO- Create a function to Update an employee's role
function updateRole() {
  console.log("Which employee's role do you want to update?");
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
