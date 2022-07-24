const inquirer = require("inquirer");
const storeFunctions = require("./db/storeFunctions");
const consoleTable = require("console.table");
//36 long
// console.log(`
// +-----------------------------------------------------------------------------------+
// | /-----------------------------------/   +---------------------------------------+ |
// +----------------------------------+`);
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
          return departments.start().then(departments.queryDepartment);
        case "View all roles":
          const roles = new storeFunctions();
          return roles.start().then(roles.queryRoles);
      }
    })
    .then((departments) => {
      console.table(departments);
    })
    .then(mainMenu);
};

mainMenu();
