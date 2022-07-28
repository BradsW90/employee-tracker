const inquirer = require("inquirer");
const storeFunctions = require("./db/storeFunctions");
const consoleTable = require("console.table");
//36 long
// console.log(`
// +-----------------------------------------------------------------------------------+
// | /-----------------------------------/   +---------------------------------------+ |
// +----------------------------------+`);

const department = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter a new department name.",
      validate: (name) => {
        if (name) {
          return true;
        } else {
          console.log("Please enter a department name!");
          return false;
        }
      },
    },
  ]);
};

const role = (department) => {
  let list = [];

  for (i = 0; i < department.length; i++) {
    list.push(department[i].name);
  }

  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title for the new role?",
      validate: (title) => {
        if (title) {
          return true;
        } else {
          console.log("Please enter a role title!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role.",
      validate: (salary) => {
        if (parseFloat(salary) % 1 >= 0 && !Number.isNaN(parseInt(salary))) {
          console.log(parseFloat(salary));
          return true;
        } else {
          console.log("Please enter a valid salary!");
          return false;
        }
      },
    },
    {
      type: "list",
      name: "department_id",
      message: "What department does the role belong to?",
      choices: list,
    },
  ]);
};

const mainMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((choice) => {
      switch (choice.menu) {
        case "View all departments":
          const departments = new storeFunctions();
          return departments.queryDepartment().then((selection) => {
            console.table(selection);
          });
        case "View all roles":
          const roles = new storeFunctions();
          return roles.queryRoles().then((selection) => {
            console.table(selection);
          });
        case "View all employees":
          const employees = new storeFunctions();
          return employees.queryEmployees().then((selection) => {
            console.table(selection);
          });
        case "Add a department":
          const newDepartment = new storeFunctions();
          return department().then(newDepartment.addDepartment);
        case "Add a role":
          const newrole = new storeFunctions();
          return newrole.queryDepartment().then(role).then(newrole.addRole);
      }
    })
    .then(mainMenu);
};

mainMenu();
