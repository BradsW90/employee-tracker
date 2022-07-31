const inquirer = require("inquirer");
const storeFunctions = require("./db/storeFunctions");
const consoleTable = require("console.table");
//36 long
// console.log(`
// +-----------------------------------------------------------------------------------+
// | /-----------------------------------/   +---------------------------------------+ |
// +----------------------------------+`);

//updates chosen current employee role
const update = async (connection) => {
  //grabs first name and last name of employee table
  const employeeOutput = await connection[0]
    .execute(`SELECT CONCAT(first_name, ' ', last_name)
  AS name
  FROM employees`);

  //grabs title column from roles table
  const roleOutput = await connection[0].execute(`SELECT title FROM roles`);

  //main empty array
  let outputList = [];
  // first secondary array
  let temp1 = [];

  //for loop to change objects to array of strings
  for (let j = 0; j < employeeOutput[0].length; j++) {
    temp1.push(employeeOutput[0][j].name);
  }

  //pushes temp to main array
  outputList.push(temp1);
  //second secondary array
  let temp2 = [];

  //for loop to change objects to array of strings
  for (let k = 0; k < roleOutput[0].length; k++) {
    temp2.push(roleOutput[0][k].title);
  }

  //pushes second secondary to main array
  outputList.push(temp2);

  return inquirer.prompt([
    {
      type: "list",
      name: "updateEmployee",
      message: "Select the employee whose role you would like to update.",
      choices: outputList[0],
    },
    {
      type: "list",
      name: "newRole",
      message: "What is the employees new role.",
      choices: outputList[1],
    },
  ]);
};

//creates new employee
const employee = (roles) => {
  //main array
  let storeList = [];

  //for loop to iterate through arrays
  for (let d = 0; d < roles.length; d++) {
    // secondary array
    let temp = [];

    //changes array of objects to array of strings
    for (let e = 0; e < roles[d].length; e++) {
      temp.push(roles[d][e].name);
    }
    //stores transformed arrays
    storeList.push(temp);
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
      choices: storeList[0],
    },
    {
      type: "list",
      name: "manager_id",
      message: "What is the manager",
      choices: storeList[1],
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

//creates new role
const role = (department) => {
  //main array
  let list = [];

  //changes array of objects to array of strings
  for (i = 0; i < department.length; i++) {
    //adds department id to list name
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
      //uses switch to run appropriate selection from main menu
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
            .start()
            .then(newEmployee.addEmployeeQuery)
            .then(employee)
            .then(newEmployee.start)
            .then(newEmployee.addEmployee);
        case "Update an employee role":
          const newUpdate = new storeFunctions();
          return newUpdate
            .start()
            .then(update)
            .then(newUpdate.start)
            .then(newUpdate.updateEmployee);
      }
    })
    .then(mainMenu);
};

mainMenu();
