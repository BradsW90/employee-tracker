const inquirer = require("inquirer");
const storeFunctions = require("./db/storeFunctions");
const consoleTable = require("console.table");
//36 long
// console.log(`
// +-----------------------------------------------------------------------------------+
// | /-----------------------------------/   +---------------------------------------+ |
// +----------------------------------+`);

const employee = (roles) => {
  let roleList = [];

  for (let b = 0; b < roles.length; b++) {
    roleList.push(roles[b].id + " " + roles[b].title);
  }

  return inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the employees first name.",
      validate: (first_name) => {
        if (first_name) {
          return true;
        } else {
          console.log("Please enter the employees first name!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the employees last name.",
      validate: (last_name) => {
        if (last_name) {
          return true;
        } else {
          console.log("Please enter the employees last name!");
          return false;
        }
      },
    },
    {
      type: "list",
      name: "role_id",
      message: "What role will the employee fulfill?",
      choices: roleList,
    },
  ]);
};

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
    list.push(department[i].id + " " + department[i].name);
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
          return department()
            .then(newDepartment.start)
            .then(newDepartment.addDepartment);
        case "Add a role":
          const newrole = new storeFunctions();
          return newrole
            .queryDepartment()
            .then(role)
            .then(newrole.start)
            .then(newrole.addRole);
        case "Add an employee":
          const newEmployee = new storeFunctions();
          return newEmployee
            .queryRoles()
            .then(employee)
            .then(newEmployee.start)
            .then(newEmployee.addEmployee);
      }
    })
    .then(mainMenu);
};

mainMenu();
