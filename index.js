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
    // TODO- Create a variable to store the user's choice
    const choice = res.doList;
    // TODO- Create a switch statement to call the appropriate function depending on what the user chose
    switch (choice) {
      case 'View All Departments':
        console.log('Here are all departments');
        break;
      case 'View All Roles':
        console.log('Here are all roles');
        break;
      case 'View All Employees':
        console.log('Here are all employees');
        break;
      case 'Add a Department':
        console.log('What is the name of the department?');
        break;
      case 'Add a Role':
        console.log('What is the name of the role?');
        break;
      case 'Add an Employee':
        console.log('What is the name of the employee?');
        break;
      case 'Update Employee Role':
        console.log("Which employee's role do you want to update?");
        break;
      default:
        quit();
        break;
    }
  });
}

// TODO- Create a function to View all employees
function viewEmployees() {}

// BONUS- Create a function to View all employees that belong to a department

// BONUS- Create a function to View all employees that report to a specific manager

// BONUS- Create a function to Delete an employee

// TODO- Create a function to Update an employee's role

// BONUS- Create a function to Update an employee's manager

// TODO- Create a function to View all roles

// TODO- Create a function to Add a role

// BONUS- Create a function to Delete a role

// TODO- Create a function to View all deparments

// TODO- Create a function to Add a department

// BONUS- Create a function to Delete a department

// BONUS- Create a function to View all departments and show their total utilized department budget

// TODO- Create a function to Add an employee

// Exit the application
function quit() {
  console.log("Goodbye!");
  process.exit();
}
